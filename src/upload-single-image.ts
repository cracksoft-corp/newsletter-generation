import * as path from "path";
import * as fs from "fs/promises";
import sharp from "sharp";
import { uploadImage } from "./images/upload-image-to-kit";

const imageArgument = process.argv[2];
if (!imageArgument) {
  console.error("Usage: node dist/upload-single-image.js <image-path>");
  process.exit(1);
}


async function uploadSingleImage(imageArg: string) {
  const imagePath = path.resolve(imageArg);
  const parsed = path.parse(imagePath);
  const resizedPath = path.join(parsed.dir, `${parsed.name}-resized${parsed.ext}`);

  // Resize to max width 100px, maintaining aspect ratio
  await sharp(imagePath)
    .resize({ width: 100 })
    .jpeg({ quality: 95 }) // Use JPEG with quality set to 80
    .toFile(resizedPath);

  // Upload the resized image
  const uploadUrl = await uploadImage(resizedPath);
  console.log(`✅ Image uploaded to: ${uploadUrl}`);

  // Optional: clean up
  await fs.unlink(resizedPath);
}

uploadSingleImage(imageArgument);