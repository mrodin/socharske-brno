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

    // Get statue_id and message from request body
    const { statue_id: statueId, message } = await req.json();

    if (!statueId) {
      return new Response(JSON.stringify({ error: "Missing statue_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!message) {
      return new Response(JSON.stringify({ error: "Missing message" }), {
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

    // Insert the feedback
    const { error: insertError } = await supabase
      .from("user_feedbacks")
      .insert({
        profile_id: profileId,
        statue_id: statueId,
        message: message,
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
