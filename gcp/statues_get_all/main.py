import os

import flask
import functions_framework
from supabase import Client, create_client


@functions_framework.http
def statues_get_all(request: flask.Request) -> list[dict]:
    """Get all statues from the database."""
    supabase_url, supabase_key = (
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_KEY"),
    )

    supabase: Client = create_client(supabase_url, supabase_key)
    statues = supabase.table("statues").select("*").execute().data
    statue_scores = supabase.table("statue_scores").select("*").execute().data
    # Create dictionary mapping statue_id to score for O(1) lookups
    score_map = {score["statue_id"]: score["score"] for score in statue_scores}

    # Assign scores in a single pass
    for statue in statues:
        statue["score"] = score_map.get(statue["id"], 5)

    return statues
