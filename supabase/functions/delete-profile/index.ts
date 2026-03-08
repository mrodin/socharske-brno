// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");

  let userMessage;

  try {
    const body = await req.json();
    userMessage = body?.message;
  } catch {
    userMessage = null;
  }

  console.log("Delete profile request message:", userMessage);

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response("Invalid user", { status: 403 });
  }

  const userId = user.id;

  // Log the deletion reason in a separate table
  const { error: insertError } = await supabase.from("deleted_users").insert({
    user_id: userId,
    email: user.email,
    message: userMessage || null,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Failed to log deletion reason:", insertError);
  }

  // Finally, delete the user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error("Failed to delete user:", deleteError);
    return new Response(deleteError.message, { status: 500 });
  }

  return new Response("User deleted", { status: 200 });
});
