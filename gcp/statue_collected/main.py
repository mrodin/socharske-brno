import os

import flask
import functions_framework
from supabase import Client, create_client


@functions_framework.http
def statue_collected(request: flask.Request) -> str:
    """Collect a statue."""
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

    statue_id = request.json["statue_id"]
    data = (
        supabase.table("statues")
        .select("*", count="exact")
        .eq("id", statue_id)
        .execute()
    )
    if not data.count:
        return "Statue does not exist!"
    data = (
        supabase.table("profile_statue_collected")
        .select("*", count="exact")
        .eq("profile_id", profile_id)
        .eq("statue_id", statue_id)
        .execute()
    )
    if data.count:
        return "Statue already collected by user!"
    supabase.table("profile_statue_collected").insert(
        {"profile_id": profile_id, "statue_id": statue_id},
    ).execute()

    return "OK"
