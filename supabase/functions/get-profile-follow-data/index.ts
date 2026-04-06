import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const profileId =
    (await req
      .json()
      .then((body) => body.profileId)
      .catch(() => null)) || userData.user.id;

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

  const [followsResult, followersResult] = await Promise.all([
    supabase
      .from("profile_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profileId),
    supabase
      .from("profile_follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", profileId),
  ]);

  if (followsResult.error) {
    return new Response(
      JSON.stringify({ error: followsResult.error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (followersResult.error) {
    return new Response(
      JSON.stringify({ error: followersResult.error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      followingCount: followsResult.count || 0,
      followersCount: followersResult.count || 0,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
