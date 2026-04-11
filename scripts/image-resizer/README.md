# Image Resizer

Resizes statue images into three thumbnail sizes (96px, 480px, 1242px) using [sharp](https://sharp.pixelplumbing.com/).

## How it works

Given a folder of images named `{number}.jpg` / `.jpeg` (e.g. `126.jpg`), the script creates the following structure for each image:

```
126/
  thumb96/1.JPEG
  thumb480/1.JPEG
  thumb1242/1.JPEG
```

Each thumbnail is resized so the longest side matches the target size, preserving aspect ratio. EXIF orientation is applied automatically.

## Usage

```bash
npm install
node resize_images.js <folder-path>
```
