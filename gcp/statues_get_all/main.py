import os

import functions_framework
from supabase import Client, create_client


@functions_framework.http
def statues_get_all(request):
    """Get all statues from the database."""
    supabase_url, supabase_key = (
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_KEY"),
    )

    supabase: Client = create_client(supabase_url, supabase_key)
    res = supabase.table("statues").select("*").execute().data
    return res
