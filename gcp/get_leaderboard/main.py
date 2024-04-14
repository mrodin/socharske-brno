import os
from operator import itemgetter
from typing import TypedDict

import flask
import functions_framework
from supabase import Client, create_client


class LeaderboardEntry(TypedDict):
    """One entry in the leaderboard."""

    id: str  # UUID might be a better type
    score: float


@functions_framework.http
def get_leaderboard(request: flask.Request) -> list[LeaderboardEntry]:
    """Get the leaderboard with total score for each profile."""
    supabase_url, supabase_key = (
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_KEY"),
    )

    supabase: Client = create_client(supabase_url, supabase_key)
    data = (
        supabase.table("profile_statue_collected")
        .select("profile_id", "value")
        .execute()
    )
    leaderboard: list[LeaderboardEntry] = []
    profile_score: dict[str, float] = {}
    for entry in data.data:
        profile_id, value = entry["profile_id"], entry["value"]
        profile_score[profile_id] = profile_score.get(profile_id, 0) + value

    leaderboard = [
        LeaderboardEntry(id=k, score=v) for k, v in profile_score.items()
    ]
    return sorted(leaderboard, key=itemgetter("score"), reverse=True)
