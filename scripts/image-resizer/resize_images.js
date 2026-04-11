const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const SIZES = [96, 480, 1242];
const VALID_EXTENSIONS = new Set([".jpg", ".jpeg"]);
const CONCURRENCY_LIMIT = 4;
const OUTPUT_FILENAME = "1.JPEG";

async function processImage(filename, inputDir) {
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  const sourcePath = path.join(inputDir, filename);
  const outputBaseDir = path.join(inputDir, baseName);

  await fs.mkdir(outputBaseDir, { recursive: true });

  for (const size of SIZES) {
    const thumbDir = path.join(outputBaseDir, `thumb${size}`);
    await fs.mkdir(thumbDir, { recursive: true });

    const outputPath = path.join(thumbDir, OUTPUT_FILENAME);

    const info = await sharp(sourcePath)
      .rotate()
      .resize(size, size, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    console.log(
      `  Created ${path.relative(inputDir, outputPath)} (${info.width}x${info.height})`,
    );
  }
}

async function processWithConcurrency(files, inputDir, limit) {
  let index = 0;
  let successCount = 0;
  let errorCount = 0;
  const total = files.length;

  async function worker() {
    while (index < files.length) {
      const currentIndex = index++;
      const file = files[currentIndex];
      console.log(`[${currentIndex + 1}/${total}] Processing ${file}...`);
      try {
        await processImage(file, inputDir);
        successCount++;
      } catch (err) {
        console.error(`  Error processing ${file}: ${err.message}`);
        errorCount++;
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, files.length) }, () =>
    worker(),
  );
  await Promise.all(workers);

  return { successCount, errorCount };
}

async function main() {
  const inputDir = process.argv[2];

  if (!inputDir) {
    console.error("Usage: node resize_images.js <folder-path>");
    process.exit(1);
  }

  const resolvedDir = path.resolve(inputDir);

  try {
    const stat = await fs.stat(resolvedDir);
    if (!stat.isDirectory()) {
      console.error(`Error: "${resolvedDir}" is not a directory.`);
      process.exit(1);
    }
  } catch {
    console.error(`Error: Directory "${resolvedDir}" does not exist.`);
    process.exit(1);
  }

  const entries = await fs.readdir(resolvedDir);
  const imageFiles = entries.filter((entry) => {
    const ext = path.extname(entry);
    if (!VALID_EXTENSIONS.has(ext.toLowerCase())) return false;
    const name = path.basename(entry, ext);
    return /^\d+$/.test(name);
  });

  if (imageFiles.length === 0) {
    console.warn(
      "No matching images found (expected {number}.jpg or {number}.jpeg).",
    );
    process.exit(0);
  }

  console.log(`Found ${imageFiles.length} image(s) in ${resolvedDir}`);
  console.log(
    `Generating thumbnails: ${SIZES.map((s) => `thumb${s}`).join(", ")}\n`,
  );

  const { successCount, errorCount } = await processWithConcurrency(
    imageFiles,
    resolvedDir,
    CONCURRENCY_LIMIT,
  );

  console.log(
    `\nDone. Processed ${successCount} image(s) successfully, ${errorCount} error(s).`,
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
