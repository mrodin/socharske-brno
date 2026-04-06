import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendExpoPushNotifications, type ExpoPushMessage } from "../_shared/push.ts";

const NOTIFICATION_TYPE = "inactive-users";
const INACTIVE_DAYS = 7;

Deno.serve(async (req) => {
  // This endpoint is called by a pg_cron job, not by users.
  // The cron job sends the service_role_key as the Bearer token (from Vault).
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey || req.headers.get("Authorization") !== `Bearer ${serviceRoleKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json().catch(() => ({}));
  const force = body?.force === true;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const expoAccessToken = Deno.env.get("EXPO_ACCESS_TOKEN")!;

  // --- 1. Get total number of visible statues ---
  const { count: totalStatues, error: statuesError } = await supabase
    .from("statues")
    .select("*", { count: "exact", head: true })
    .eq("visible", true);

  if (statuesError) {
    return new Response(JSON.stringify({ error: statuesError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cutoffDate = new Date(
    Date.now() - INACTIVE_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  // --- 2. Find profiles that were already notified within the cooldown window ---
  let recentlyNotifiedIds: string[] = [];

  if (!force) {
    const { data: recentlyNotified, error: logError } = await supabase
      .from("push_notification_log")
      .select("profile_id")
      .eq("notification_type", NOTIFICATION_TYPE)
      .gte("sent_at", cutoffDate);

    if (logError) {
      return new Response(JSON.stringify({ error: logError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    recentlyNotifiedIds = recentlyNotified.map((r) => r.profile_id);
  }

  // --- 2b. Get profiles that have opted out of this notification type ---
  const { data: optedOut, error: prefError } = await supabase
    .from("push_notification_prefs")
    .select("profile_id")
    .eq("notification_type", NOTIFICATION_TYPE)
    .eq("enabled", false);

  if (prefError) {
    return new Response(JSON.stringify({ error: prefError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const optedOutIds = optedOut.map((r) => r.profile_id);

  // --- 3. Get candidate profiles ---
  // Must have: a push token, an account older than 7 days, and not been notified recently.
  let profileQuery = supabase
    .from("profiles")
    .select("id, expo_push_token")
    .not("expo_push_token", "is", null);

  if (!force) {
    profileQuery = profileQuery.lt("created_at", cutoffDate);
  }

  if (recentlyNotifiedIds.length > 0) {
    profileQuery = profileQuery.not(
      "id",
      "in",
      `(${recentlyNotifiedIds.join(",")})`,
    );
  }

  if (optedOutIds.length > 0) {
    profileQuery = profileQuery.not(
      "id",
      "in",
      `(${optedOutIds.join(",")})`,
    );
  }

  const { data: profiles, error: profilesError } = await profileQuery;

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!profiles || profiles.length === 0) {
    return new Response(
      JSON.stringify({ sent: 0, message: "No candidates found" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  // --- 4. Get each candidate's collection stats ---
  const profileIds = profiles.map((p) => p.id);

  const { data: collectionData, error: collectionError } = await supabase
    .from("profile_statue_collected")
    .select("profile_id, created_at")
    .in("profile_id", profileIds);

  if (collectionError) {
    return new Response(JSON.stringify({ error: collectionError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build per-profile stats: last collection date and total collected count
  const profileStats: Record<
    string,
    { lastCollectedAt: string; count: number }
  > = {};
  for (const row of collectionData) {
    const existing = profileStats[row.profile_id];
    if (!existing || row.created_at > existing.lastCollectedAt) {
      profileStats[row.profile_id] = {
        lastCollectedAt: row.created_at,
        count: (existing?.count ?? 0) + 1,
      };
    } else {
      existing.count++;
    }
  }

  // --- 5. Filter down to users who are actually inactive and not completionists ---
  const cutoff = new Date(cutoffDate);

  const toNotify = profiles.filter((profile) => {
    const stats = profileStats[profile.id];

    // Skip users who have collected all visible statues
    if (stats && stats.count >= (totalStatues ?? 0)) {
      return false;
    }

    // Notify users who have never collected anything
    if (!stats) {
      return true;
    }

    // In force mode, skip the inactivity time check
    if (force) {
      return true;
    }

    // Notify users whose last collection was more than 7 days ago
    return new Date(stats.lastCollectedAt) < cutoff;
  });

  if (toNotify.length === 0) {
    return new Response(
      JSON.stringify({ sent: 0, message: "No inactive users to notify" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  // --- 6. Send push notifications ---
  const messages: ExpoPushMessage[] = toNotify.map((profile) => ({
    to: profile.expo_push_token!,
    title: "Brno na tebe čeká! 🗿",
    body: "Týden jsi neobjevoval žádné sochy. Vrať se a pokračuj v kolekci!",
  }));

  const tickets = await sendExpoPushNotifications(messages, expoAccessToken);

  // --- 7. Log only the successfully delivered notifications ---
  const logEntries: { profile_id: string; notification_type: string }[] = [];
  let sent = 0;
  let errors = 0;

  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].status === "ok") {
      sent++;
      logEntries.push({
        profile_id: toNotify[i].id,
        notification_type: NOTIFICATION_TYPE,
      });
    } else {
      errors++;
      console.error(
        `Failed ticket for profile ${toNotify[i].id}:`,
        tickets[i].message,
      );
    }
  }

  if (logEntries.length > 0) {
    const { error: insertError } = await supabase
      .from("push_notification_log")
      .insert(logEntries);

    if (insertError) {
      console.error("Failed to write notification log:", insertError.message);
    }
  }

  return new Response(
    JSON.stringify({ sent, errors, candidates: toNotify.length }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
