const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabaseUrl = "<SUPABASE_URL>";
const supabaseKey = "<SUPABASE_KEY>";
const supabase = createClient(supabaseUrl, supabaseKey);

// Load JSON data
const data = JSON.parse(fs.readFileSync("statues.json", "utf8"));

const convertToString = (value) => {
  if (value === null) {
    return null;
  }

  return String(value);
};

// Iterate over JSON objects
data.features.forEach(async (item) => {
  const { attributes, geometry } = item;

  const row = {
    code: attributes.kod,
    name: convertToString(attributes.nazev),
    district: convertToString(attributes.adresa_momc),
    street: convertToString(attributes.adresa_ulice),
    house_number: convertToString(attributes.adresa_cislo_domovni),
    street_number: convertToString(attributes.adresa_cislo_orientacni),
    x: geometry.x,
    y: geometry.y,
    description: convertToString(attributes.popis_objektu),
    style: convertToString(attributes.sloh),
    material: convertToString(attributes.material),
    administrator: convertToString(attributes.spravce),
    type: convertToString(attributes.typ),
    category: convertToString(attributes.druh),
    url_3d: convertToString(attributes.url_3d),
    author: convertToString(attributes.autor_dila),
    year: convertToString(attributes.rok_vytvoreni),
    url_wiki: convertToString(attributes.url_odkaz_enc),
    url_catalog: convertToString(attributes.url_odkaz_katalog),
  };

  const { error } = await supabase.from("statues").insert([row]);

  // Check for errors
  if (error) console.error("Error inserting item:", error);
});
