import os

import flask
import functions_framework
from google.cloud import storage
from supabase import Client, create_client

STORAGE_URL = "https://storage.googleapis.com"


@functions_framework.http
def upload_avatar(request: flask.Request) -> list[int] | str:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    bucket_name = os.getenv("BUCKET_NAME")

    supabase: Client = create_client(supabase_url, supabase_key)
    jwt = request.headers["Authorization"].removeprefix("Bearer ")
    response = supabase.auth.get_user(jwt)
    profile_id = response.user.id
    data = (
        supabase.table("profiles")
        .select("*", count="exact")
        .eq("id", profile_id)
        .execute()
    )

    if not data.count:
        return {"error": "User does not exist!"}, 404

    if request.method != "POST":
        return {"error": "Only POST method is allowed"}, 405

    if "file" not in request.files:
        return {"error": "No file in request"}, 400

    file = request.files["file"]
    if not file or file.filename == "":
        return {"error": "No file selected"}, 400

    try:
        # Initialize with explicit credentials
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)

        # Create a unique filename to avoid collisions
        blob = bucket.blob(f"{os.urandom(20).hex()}.jpg")

        # Delete previous uploaded avatar if it exists
        # Database contains link to the avatar on auth provider (Google, Facebook)
        if data.data[0]["avatar_url"] and data.data[0]["avatar_url"].startswith(
            STORAGE_URL
        ):
            file_name = data.data[0]["avatar_url"].split("/")[-1]
            bucket.delete_blob(file_name)

        # Upload file without setting ACL
        blob.upload_from_file(file)

        # Use direct public URL - bucket must be configured for public access
        url = f"{STORAGE_URL}/{bucket.name}/{blob.name}"

        return {"message": "File uploaded successfully", "url": url}, 200

    except Exception as e:
        return {"error": f"Error uploading file: {str(e)}"}, 500
