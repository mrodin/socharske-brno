const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = "<SUPABASE_URL>";
const supabaseKey = "<SUPABASE_KEY>";
const supabase = createClient(supabaseUrl, supabaseKey);

// Load JSON data
const data = JSON.parse(fs.readFileSync("statues.json", "utf8"));

// Iterate over JSON objects
data.features.forEach(async (item) => {
  const { attributes, geometry } = item;

  const row = {
    code: attributes.kod,
    name: String(attributes.nazev),
    district: String(attributes.adresa_momc),
    street: String(attributes.adresa_ulice),
    house_number: String(attributes.adresa_cislo_domovni),
    street_number: String(attributes.adresa_cislo_orientacni),
    x: geometry.x,
    y: geometry.y,
    description: String(attributes.popis_objektu),
    style: String(attributes.sloh),
    material: String(attributes.material),
    administrator: String(attributes.spravce),
    type: String(attributes.typ),
    category: String(attributes.druh),
    url_3d: String(attributes.url_3d),
    author: String(attributes.autor_dila),
    year: String(attributes.rok_vytvoreni),
    url_wiki: String(attributes.url_odkaz_enc),
    url_catalog: String(attributes.url_odkaz_katalog),
  };

  const { error } = await supabase.from("statues").insert([row]);

  // Check for errors
  if (error) console.error("Error inserting item:", error);
});
