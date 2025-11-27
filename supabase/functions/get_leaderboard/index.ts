import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MAX_LEADERBOARD_SIZE = 10;

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  avatar: string | null;
}

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get all collected statues with their values
  const { data: collectedData, error: collectedError } = await supabase
    .from("profile_statue_collected")
    .select("profile_id, value");

  if (collectedError) {
    return new Response(JSON.stringify({ error: collectedError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Calculate total score for each profile
  const profileScore: Record<string, number> = {};
  for (const entry of collectedData) {
    const profileId = entry.profile_id;
    const value = entry.value;
    profileScore[profileId] = (profileScore[profileId] || 0) + value;
  }

  // Get all profiles
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, avatar_url");

  if (profilesError) {
    return new Response(JSON.stringify({ error: profilesError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build leaderboard
  const leaderboard: LeaderboardEntry[] = profilesData.map(
    (entry: { id: string; username: string; avatar_url: string | null }) => ({
      id: entry.id,
      username: entry.username,
      avatar: entry.avatar_url,
      score: profileScore[entry.id] || 0,
    })
  );

  // Sort by score descending and limit to MAX_LEADERBOARD_SIZE
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LEADERBOARD_SIZE);

  return new Response(JSON.stringify(sortedLeaderboard), {
    headers: { "Content-Type": "application/json" },
  });
});
