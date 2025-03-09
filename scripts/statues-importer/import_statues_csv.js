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

fs.createReadStream("statues.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
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

      const { error } = await supabase.from("statues").insert([row]);
      if (error) console.error("Error inserting item:", error);
    }
    console.log(`Imported ${results.length} rows`);
  });

const convertEmptyStringToNull = (value) => {
  if (value === "") {
    return null;
  }

  return value;
};
