import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
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
    const { data: userData, error: userError } =
      await supabase.auth.getUser(jwt);

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const followerId = userData.user.id;

    // Check if user profile exists
    const { count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", followerId);

    if (!profileCount) {
      return new Response(JSON.stringify({ error: "User does not exist!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get following_id and from request body
    const { following_id: followingId } = await req.json();

    if (!followingId) {
      return new Response(JSON.stringify({ error: "Missing following_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (followerId === followingId) {
      return new Response(
        JSON.stringify({ error: "User cannot follow themselves" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Check if target profile exists
    const { count: targetCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", followingId);

    if (!targetCount) {
      return new Response(
        JSON.stringify({ error: "Target profile does not exist!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Check if already following
    const { count: followCount } = await supabase
      .from("profile_follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (followCount) {
      // Already following — unfollow
      const { error: deleteError } = await supabase
        .from("profile_follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);

      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ status: "success", action: "unfollowed" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Not yet following — follow
    const { error: insertError } = await supabase
      .from("profile_follows")
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ status: "success", action: "followed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
