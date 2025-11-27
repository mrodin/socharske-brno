// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Storage } from "npm:@google-cloud/storage@7";

const STORAGE_URL = "https://storage.googleapis.com";
const BUCKET_NAME = "lovci-soch-avatars";

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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from JWT
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

    // Initialize Google Cloud Storage with credentials from env
    const gcpCredentials = JSON.parse(Deno.env.get("GCP_SERVICE_ACCOUNT_KEY")!);
    const storage = new Storage({
      credentials: gcpCredentials,
      projectId: gcpCredentials.project_id,
    });
    const bucket = storage.bucket(BUCKET_NAME);

    // Generate unique filename
    const randomBytes = new Uint8Array(20);
    crypto.getRandomValues(randomBytes);
    const hexString = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const fileName = `${hexString}.jpg`;

    // Delete previous uploaded avatar if it exists and is from our storage
    const currentAvatarUrl = profileData?.[0]?.avatar_url;
    if (currentAvatarUrl && currentAvatarUrl.startsWith(STORAGE_URL)) {
      const oldFileName = currentAvatarUrl.split("/").pop();
      if (oldFileName) {
        try {
          await bucket.file(oldFileName).delete();
        } catch (deleteError) {
          // Ignore delete errors (file might not exist)
          console.warn("Failed to delete old avatar:", deleteError);
        }
      }
    }

    // Upload file to GCS
    const fileBuffer = await file.arrayBuffer();
    const blob = bucket.file(fileName);
    await blob.save(new Uint8Array(fileBuffer), {
      contentType: file.type || "image/jpeg",
    });

    // Construct public URL
    const url = `${STORAGE_URL}/${BUCKET_NAME}/${fileName}`;

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
