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

    # Get all statues and their scores using foreign table syntax
    statues = supabase.from_("statues").select("*, statue_scores(score)").execute().data

    # Process the nested data structure to have a flat score field
    for statue in statues:
        scores = statue.pop("statue_scores", [])
        if scores and len(scores) > 0 and scores[0] and "score" in scores[0]:
            statue["score"] = scores[0]["score"]
        else:
            statue["score"] = 5

    return statues
