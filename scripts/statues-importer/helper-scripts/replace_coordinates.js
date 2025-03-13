const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { stringify } = require("csv-stringify/sync");

// File paths
const csvFilePath = path.join(__dirname, "statues_with_code.csv");
const jsonFilePath = path.join(__dirname, "statues.json");
const outputFilePath = path.join(__dirname, "statues_final.csv");

// Function to read the JSON file
function readJsonFile() {
  try {
    const jsonData = fs.readFileSync(jsonFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    process.exit(1);
  }
}

// Function to create a map of kod to coordinates from JSON
function createCoordinatesMap(jsonData) {
  const coordinatesMap = new Map();

  if (!jsonData.features || !Array.isArray(jsonData.features)) {
    console.error('Invalid JSON structure: "features" array not found');
    process.exit(1);
  }

  jsonData.features.forEach((feature) => {
    if (feature.attributes && feature.attributes.kod && feature.geometry) {
      coordinatesMap.set(feature.attributes.kod.toString(), {
        x: feature.geometry.x,
        y: feature.geometry.y,
      });
    }
  });

  return coordinatesMap;
}

// Main function to process the CSV and create a new one with correct coordinates
async function processCSV(coordinatesMap) {
  const results = [];
  const headers = [];
  let headersParsed = false;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("headers", (headerList) => {
        headers.push(...headerList);
        headersParsed = true;
      })
      .on("data", (data) => {
        // Create a copy of the row
        const newRow = { ...data };

        // Check if the statue has a matching entry in the JSON
        if (data.kod && coordinatesMap.has(data.kod)) {
          const correctCoordinates = coordinatesMap.get(data.kod);
          newRow.x = correctCoordinates.x;
          newRow.y = correctCoordinates.y;
        }

        results.push(newRow);
      })
      .on("end", () => {
        // Write the results to a new CSV file
        try {
          const csvOutput = stringify(results, {
            header: true,
            columns: headers,
          });
          fs.writeFileSync(outputFilePath, csvOutput);
          console.log(
            `Successfully created ${outputFilePath} with corrected coordinates.`
          );

          // Count how many coordinates were updated
          const updatedCount = results.filter(
            (row) => row.kod && coordinatesMap.has(row.kod)
          ).length;

          console.log(
            `Updated coordinates for ${updatedCount} out of ${results.length} statues.`
          );
          resolve();
        } catch (error) {
          console.error("Error writing CSV file:", error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error("Error processing CSV:", error);
        reject(error);
      });
  });
}

// Main execution
async function main() {
  console.log("Reading JSON file...");
  const jsonData = readJsonFile();

  console.log("Creating coordinates map...");
  const coordinatesMap = createCoordinatesMap(jsonData);
  console.log(`Found ${coordinatesMap.size} statues with coordinates in JSON.`);

  console.log("Processing CSV file...");
  await processCSV(coordinatesMap);

  console.log("Done!");
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
