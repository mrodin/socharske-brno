import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface CollectedStatue {
  statue_id: string;
  created_at: string;
  value: number;
}

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get JWT from Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const jwt = authHeader.replace("Bearer ", "");

  // Verify user and get profile ID
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const profileId = userData.user.id;

  // Check if user exists in profiles table
  const { count, error: profileError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("id", profileId);

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!count) {
    return new Response(JSON.stringify({ error: "User does not exist!" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Get all collected statues for this user
  const { data: collectedStatues, error: collectedError } = await supabase
    .from("profile_statue_collected")
    .select("statue_id, created_at, value")
    .eq("profile_id", profileId);

  if (collectedError) {
    return new Response(JSON.stringify({ error: collectedError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(collectedStatues as CollectedStatue[]), {
    headers: { "Content-Type": "application/json" },
  });
});
