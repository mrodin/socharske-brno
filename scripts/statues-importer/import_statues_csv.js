const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const csv = require("csv-parser");
const yaml = require("js-yaml");
const path = require("path");

const envFile = fs.readFileSync(
  path.resolve(__dirname, "../../.env.yaml"),
  "utf8"
);
const envConfig = yaml.load(envFile);

const supabaseUrl = envConfig.SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];

fs.createReadStream("statues_final.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    let updatedCount = 0;
    let errorCount = 0;

    for (const result of results) {
      const row = {
        name: result.nazev,
        lng: parseFloat(result.x),
        lat: parseFloat(result.y),
        visible: true,
        description: convertEmptyStringToNull(result.popis_objektu),
        material: convertEmptyStringToNull(result.material),
        type: convertEmptyStringToNull(result.typ),
        category: convertEmptyStringToNull(result.druh),
        author: convertEmptyStringToNull(result.autor_dila),
        year: convertEmptyStringToNull(result.rok_vytvoreni),
        place: convertEmptyStringToNull(result.umisteni),
        wiki_url: convertEmptyStringToNull(result.url_odkaz_enc),
        image_url: convertEmptyStringToNull(result.obr_id1),
      };

      // Using upsert with name as the unique identifier to match existing records
      // This will update existing records or insert new ones if they don't exist
      const { error } = await supabase.from("statues").upsert([row], {
        onConflict: "id", // Assuming 'id' is a unique identifier
        ignoreDuplicates: false, // Set to true if you want to ignore inserts of duplicates
      });

      if (error) {
        console.error("Error upserting item:", error);
        errorCount++;
      } else {
        updatedCount++;
      }
    }
    console.log(
      `Updated ${updatedCount} rows, encountered ${errorCount} errors`
    );
  });

const convertEmptyStringToNull = (value) => {
  if (value === "") {
    return null;
  }

  return value;
};
