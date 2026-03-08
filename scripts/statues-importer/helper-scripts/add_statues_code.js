const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

// Paths to the CSV files
const statuesSourcePath = path.join(__dirname, "statues_source.csv");
const statuesPath = path.join(__dirname, "statues.csv");
const outputPath = path.join(__dirname, "statues_with_code.csv");

// Function to read CSV file and return a Promise with the data
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

// Main function to process the files
async function addCodeToStatues() {
  try {
    console.log("Reading source statues data...");
    const sourceStatues = await readCsv(statuesSourcePath);

    console.log("Reading target statues data...");
    const statues = await readCsv(statuesPath);

    console.log(`Source statues: ${sourceStatues.length}`);
    console.log(`Target statues: ${statues.length}`);

    // Create a map of source statues by x,y coordinates for quick lookup
    const sourceStatuesMap = new Map();
    sourceStatues.forEach((statue) => {
      // Use x,y as a composite key
      const key = `${statue.x},${statue.y}`;
      sourceStatuesMap.set(key, statue);
    });

    // Add kod to statues where x,y match
    let matchCount = 0;
    const statuesWithCode = statues.map((statue) => {
      const key = `${statue.x},${statue.y}`;

      const matchingSourceStatue = sourceStatuesMap.get(key);

      if (matchingSourceStatue) {
        console.log(
          "matchingSourceStatue",
          Object.values(matchingSourceStatue)
        );

        matchCount++;
        const updatedStatue = {
          ...statue,
          kod: Object.values(matchingSourceStatue)[0],
        };

        console.log("updatedStatue", updatedStatue);
        return updatedStatue;
      }

      // If no match found, add an empty kod field
      return {
        ...statue,
        kod: "",
      };
    });

    console.log(`Found ${matchCount} matches out of ${statues.length} statues`);

    // Get all headers from the original statues file plus the new 'kod' column
    const headers = Object.keys(statuesWithCode[0]);

    // Move 'kod' to be the first column
    const kodIndex = headers.indexOf("kod");
    if (kodIndex !== -1) {
      headers.splice(kodIndex, 1);
      headers.unshift("kod");
    }

    // Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: outputPath,
      header: headers.map((header) => ({ id: header, title: header })),
    });

    // Write the data
    await csvWriter.writeRecords(statuesWithCode);

    console.log(
      `Successfully wrote ${statuesWithCode.length} statues to ${outputPath}`
    );
    console.log("Done!");
  } catch (error) {
    console.error("Error processing statues:", error);
  }
}

// Run the main function
addCodeToStatues();
