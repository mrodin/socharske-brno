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
      },
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

  // Get IDs of all profiles that this user follows
  const { data: follows, error: followsError } = await supabase
    .from("profile_follows")
    .select("following_id")
    .eq("follower_id", profileId)
    .order("created_at", { ascending: false });

  if (followsError) {
    return new Response(JSON.stringify({ error: followsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ids = follows.map((row) => row.following_id);

  return new Response(JSON.stringify(ids), {
    headers: { "Content-Type": "application/json" },
  });
});
