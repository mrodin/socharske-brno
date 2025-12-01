// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET_NAME = "avatars";

Deno.serve(async (req) => {
  // Only allow POST method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST method is allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Check Authorization header
  const authHeader = req.headers.get("Authorization");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from JWT
    const jwt = authHeader?.replace("Bearer ", "");
    if (!jwt) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

    // Check if user profile exists and get avatar_url
    const { data: profileData, count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("id", profileId);

    if (!profileCount) {
      return new Response(JSON.stringify({ error: "User does not exist!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "No file in request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (file.size === 0) {
      return new Response(JSON.stringify({ error: "No file selected" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate unique filename
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    const hexString = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const fileName = `${hexString}.jpg`;

    // Delete previous uploaded avatar if it exists and is from our Supabase storage
    const currentAvatarUrl = profileData?.[0]?.avatar_url;
    const supabaseStoragePrefix = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`;
    if (
      currentAvatarUrl &&
      currentAvatarUrl.startsWith(supabaseStoragePrefix)
    ) {
      const oldFileName = currentAvatarUrl.replace(supabaseStoragePrefix, "");
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([oldFileName]);
        if (deleteError) {
          console.warn("Failed to delete old avatar:", deleteError);
        }
      }
    }

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, new Uint8Array(fileBuffer), {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Failed to upload file:", uploadError);
      return new Response(
        JSON.stringify({
          error: `Failed to upload file: ${uploadError.message}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const url = publicUrlData.publicUrl;

    // Update user's avatar_url in profiles table
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", profileId);

    if (updateError) {
      console.error("Failed to update avatar_url:", updateError);
    }

    return new Response(
      JSON.stringify({ message: "File uploaded successfully", url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: `Error uploading file: ${errorMessage}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
