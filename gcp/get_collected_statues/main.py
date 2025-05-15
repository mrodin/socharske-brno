import os

import flask
import functions_framework
from supabase import Client, create_client


@functions_framework.http
def get_collected_statues(request: flask.Request) -> list[any]:
    """Get all statues collected by a user."""
    supabase_url, supabase_key = (
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_KEY"),
    )

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
        return "User does not exist!"

    data = (
        supabase.table("profile_statue_collected")
        .select("statue_id", "created_at", "value", count="exact")
        .eq("profile_id", profile_id)
        .execute()
    )

    return data.data
