import os
from collections import Counter
from datetime import date, timedelta

import flask
import functions_framework
from supabase import Client, create_client


def make_distribute_scores(statues):
    total_statues = len(statues)
    total_score = total_statues * 5

    # Calculate inverse weights
    weights = [1 / (s["collect_count"] + 1) for s in statues]
    total_weight = sum(weights)

    # Initial score (float), unlimited
    ideal_scores = [w / total_weight * total_score for w in weights]

    # Round down
    base_scores = [int(s) for s in ideal_scores]
    score_sum = sum(base_scores)
    remainder = total_score - score_sum

    # Indexes and differences between ideal and rounded
    diffs = sorted(
        [(i, ideal_scores[i] - base_scores[i]) for i in range(total_statues)],
        key=lambda x: -x[1],
    )

    # Distribute the remainder point by point, but don't exceed the range of 10
    for i, _ in diffs:
        if remainder == 0:
            break
        if base_scores[i] < 10:
            base_scores[i] += 1
            remainder -= 1

    # Check range - if anyone dropped below 1 or exceeded 10, fix and adjust other points
    for _ in range(10):  # safeguard against infinite loop
        for i in range(total_statues):
            if base_scores[i] < 1:
                delta = 1 - base_scores[i]
                base_scores[i] = 1
                remainder -= delta
            elif base_scores[i] > 10:
                delta = base_scores[i] - 10
                base_scores[i] = 10
                remainder += delta

        if remainder == 0:
            break

        # Add/subtract until the sum matches
        direction = 1 if remainder > 0 else -1
        for i in range(total_statues):
            if remainder == 0:
                break
            if 1 <= base_scores[i] + direction <= 10:
                base_scores[i] += direction
                remainder -= direction

    assert sum(base_scores) == total_score, "Sum of scores is not correct!"

    return [
        {"statue_id": statues[i]["statue_id"], "score": base_scores[i]}
        for i in range(total_statues)
    ]


def create_and_insert_statue_scores(
    supabase: Client, score_data: list, record_date: str
) -> None:
    """Creates and inserts statue score records into the database.

    Args:
        supabase: The Supabase client
        score_data: List of dictionaries containing statue_id and score
        record_date: Date to use for the created_at field
    """
    records_to_insert = [
        {
            "statue_id": item["statue_id"],
            "score": item["score"],
            "created_at": record_date,
        }
        for item in score_data
    ]

    # Insert records into statue_scores
    supabase.table("statue_scores").insert(records_to_insert).execute()


def delete_old_statue_scores(supabase: Client, days: int = 7) -> None:
    """Deletes statue score records older than the specified number of days.

    Args:
        supabase: The Supabase client
        days: Number of days to keep records for (default: 7)
    """
    cutoff_date = (date.today() - timedelta(days=days)).isoformat()
    supabase.table("statue_scores").delete().lt("created_at", cutoff_date).execute()


@functions_framework.http
def update_statue_scores(_: flask.Request) -> tuple[str, int]:
    """Update statue scores based on collection data from the previous day."""
    supabase_url, supabase_key = (
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_KEY"),
    )

    supabase: Client = create_client(supabase_url, supabase_key)

    # Get all records from yesterday (regardless of hours)
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    yesterday_start = yesterday
    yesterday_end = today

    collected = (
        supabase.table("profile_statue_collected")
        .select("*")
        .gte("created_at", yesterday_start)
        .lt("created_at", yesterday_end)
        .execute()
        .data
    )

    counter = Counter([row["statue_id"] for row in collected])

    statues = supabase.table("statues").select("id").execute().data

    collected_statues = [
        {
            "statue_id": statue["id"],
            "collect_count": counter.get(statue["id"], 0),
        }
        for statue in statues
    ]

    distribute_scores = make_distribute_scores(collected_statues)

    # Create and insert statue score records
    create_and_insert_statue_scores(supabase, distribute_scores, today)

    # Clean up old records
    delete_old_statue_scores(supabase, days=7)

    return "Success", 200
