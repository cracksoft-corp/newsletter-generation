import * as path from "path";
import { uploadImage } from "./images/upload-image-to-kit";

const imageArgument = process.argv[2];
if (!imageArgument) {
  console.error("Usage: node dist/upload-single-image.js <image-path>");
  process.exit(1);
}

async function uploadSingleImage(imageArg: string) {
    const imagePath = path.resolve(imageArg);
    const uploadUrl = await uploadImage(imagePath);
    console.log(`Image uploaded to: ${uploadUrl}`);
}

uploadSingleImage(imageArgument);
