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
        }
      );
    }

    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(
      jwt
    );

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const profileId = userData.user.id;

    // Check if user profile exists
    const { count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("id", profileId);

    if (!profileCount) {
      return new Response(JSON.stringify({ error: "User does not exist!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get statue_id from request body
    const { statue_id: statueId } = await req.json();

    if (!statueId) {
      return new Response(JSON.stringify({ error: "Missing statue_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if statue exists
    const { count: statueCount } = await supabase
      .from("statues")
      .select("*", { count: "exact", head: true })
      .eq("id", statueId);

    if (!statueCount) {
      return new Response(JSON.stringify({ error: "Statue does not exist!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if statue already collected by user
    const { count: collectedCount } = await supabase
      .from("profile_statue_collected")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("statue_id", statueId);

    if (collectedCount) {
      return new Response(
        JSON.stringify({ error: "Statue already collected by user!" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the statue score
    const { data: scoreData } = await supabase
      .from("statue_scores")
      .select("score")
      .eq("statue_id", statueId)
      .order("created_at", { ascending: false })
      .limit(1);

    // Extract the score value if available, default to 1
    const statueScore =
      scoreData && scoreData.length > 0 ? scoreData[0].score : 1;

    // Insert the collected statue
    const { error: insertError } = await supabase
      .from("profile_statue_collected")
      .insert({
        profile_id: profileId,
        statue_id: statueId,
        value: statueScore,
      });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
