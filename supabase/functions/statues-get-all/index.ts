import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get all statues and their scores using foreign table syntax
  const { data: statues, error } = await supabase
    .from("statues")
    .select("*, statue_scores(score)");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Process the nested data structure to have a flat score field
  const processedStatues = statues.map((statue: Record<string, unknown>) => {
    const scores = statue.statue_scores as { score: number }[] | null;
    delete statue.statue_scores;

    if (scores && scores.length > 0 && scores[0] && "score" in scores[0]) {
      statue.score = scores[0].score;
    } else {
      statue.score = 5;
    }

    return statue;
  });

  return new Response(JSON.stringify(processedStatues), {
    headers: { "Content-Type": "application/json" },
  });
});
