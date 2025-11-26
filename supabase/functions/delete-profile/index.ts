// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  const message = (await req.json())?.message;

  console.log("Delete profile request message:", message);

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
  await supabase.from("deleted_users").insert({
    user_id: userId,
    email: user.email,
    message: message || null,
    created_at: new Date().toISOString(),
  });

  // TODO: DELETE related data in DB if needed

  // Finally, delete the user
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

  if (deleteError) {
    return new Response(deleteError.message, { status: 500 });
  }

  return new Response("User deleted", { status: 200 });
});
