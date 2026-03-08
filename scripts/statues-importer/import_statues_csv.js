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

fs.createReadStream("./data/statues_20251109.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    let updatedCount = 0;
    let errorCount = 0;

    for (const result of results) {
      const row = {
        id: parseInt(result.id, 10),
        name: result.name,
        lng: parseFloat(result.lng),
        lat: parseFloat(result.lat),
        visible: convertStringToBoolean(result.visible),
        description: convertEmptyStringToNull(result.description),
        material: convertEmptyStringToNull(result.material),
        type: convertEmptyStringToNull(result.type),
        category: convertEmptyStringToNull(result.category),
        author: convertEmptyStringToNull(result.author),
        year: convertEmptyStringToNull(result.year),
        place: convertEmptyStringToNull(result.place),
        wiki_url: convertEmptyStringToNull(result.wiki_url),
        image_url: convertEmptyStringToNull(result.image_url),
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

const convertStringToBoolean = (value) => {
  if (value === "true") {
    return true;
  }

  return false;
};
