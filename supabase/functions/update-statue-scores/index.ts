// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface Statue {
  id: string;
}

interface CollectedStatue {
  statue_id: string;
  collect_count: number;
}

interface ScoreData {
  statue_id: string;
  score: number;
}

interface CollectedRecord {
  statue_id: string;
}

/**
 * Distributes scores across statues based on their collection counts.
 * Less collected statues get higher scores.
 */
function distributeScores(statues: CollectedStatue[]): ScoreData[] {
  const totalStatues = statues.length;
  const totalScore = totalStatues * 5;

  // Calculate inverse weights - less collected = higher weight
  const weights = statues.map((s) => 1 / (s.collect_count + 1));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // Initial score (float), unlimited
  const idealScores = weights.map((w) => (w / totalWeight) * totalScore);

  // Round down
  const baseScores = idealScores.map((s) => Math.floor(s));
  let remainder = totalScore - baseScores.reduce((sum, s) => sum + s, 0);

  // Indexes and differences between ideal and rounded
  const diffs = statues
    .map((_, i) => ({ index: i, diff: idealScores[i] - baseScores[i] }))
    .sort((a, b) => b.diff - a.diff);

  // Distribute the remainder point by point, but don't exceed the range of 10
  for (const { index } of diffs) {
    if (remainder === 0) break;
    if (baseScores[index] < 10) {
      baseScores[index] += 1;
      remainder -= 1;
    }
  }

  // Check range - if anyone dropped below 1 or exceeded 10, fix and adjust other points
  for (let iteration = 0; iteration < 10; iteration++) {
    for (let i = 0; i < totalStatues; i++) {
      if (baseScores[i] < 1) {
        const delta = 1 - baseScores[i];
        baseScores[i] = 1;
        remainder -= delta;
      } else if (baseScores[i] > 10) {
        const delta = baseScores[i] - 10;
        baseScores[i] = 10;
        remainder += delta;
      }
    }

    if (remainder === 0) break;

    // Add/subtract until the sum matches
    const direction = remainder > 0 ? 1 : -1;
    for (let i = 0; i < totalStatues; i++) {
      if (remainder === 0) break;
      const newScore = baseScores[i] + direction;
      if (newScore >= 1 && newScore <= 10) {
        baseScores[i] = newScore;
        remainder -= direction;
      }
    }
  }

  const actualSum = baseScores.reduce((sum, s) => sum + s, 0);
  if (actualSum !== totalScore) {
    console.warn(
      `Sum of scores (${actualSum}) does not match expected (${totalScore})`
    );
  }

  return statues.map((statue, i) => ({
    statue_id: statue.statue_id,
    score: baseScores[i],
  }));
}

/**
 * Formats a date as ISO string (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Gets yesterday's date
 */
function getYesterday(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

/**
 * Gets date N days ago
 */
function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

Deno.serve(async (req) => {
  // Verify the request has valid authorization (from pg_cron via pg_net with service_role key)
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing authorization header" }),
      { headers: { "Content-Type": "application/json" }, status: 401 }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get all records from yesterday
    const today = formatDate(new Date());
    const yesterday = formatDate(getYesterday());

    const { data: collected, error: collectedError } = await supabase
      .from("profile_statue_collected")
      .select("statue_id")
      .gte("created_at", yesterday)
      .lt("created_at", today);

    if (collectedError) {
      throw new Error(
        `Failed to fetch collected statues: ${collectedError.message}`
      );
    }

    // Count collections per statue
    const counter = new Map<string, number>();
    for (const row of collected as CollectedRecord[]) {
      counter.set(row.statue_id, (counter.get(row.statue_id) || 0) + 1);
    }

    // Get all statues
    const { data: statues, error: statuesError } = await supabase
      .from("statues")
      .select("id");

    if (statuesError) {
      throw new Error(`Failed to fetch statues: ${statuesError.message}`);
    }

    // Build collected statues with counts
    const collectedStatues: CollectedStatue[] = (statues as Statue[]).map(
      (statue) => ({
        statue_id: statue.id,
        collect_count: counter.get(statue.id) || 0,
      })
    );

    // Calculate scores
    const scoreData = distributeScores(collectedStatues);

    // Create records to insert
    const recordsToInsert = scoreData.map((item) => ({
      statue_id: item.statue_id,
      score: item.score,
      created_at: today,
    }));

    // Insert records into statue_scores
    const { error: insertError } = await supabase
      .from("statue_scores")
      .insert(recordsToInsert);

    if (insertError) {
      throw new Error(`Failed to insert statue scores: ${insertError.message}`);
    }

    // Clean up old records (older than 7 days)
    const cutoffDate = formatDate(getDaysAgo(7));
    const { error: deleteError } = await supabase
      .from("statue_scores")
      .delete()
      .lt("created_at", cutoffDate);

    if (deleteError) {
      throw new Error(
        `Failed to delete old statue scores: ${deleteError.message}`
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Statue scores updated" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating statue scores:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
