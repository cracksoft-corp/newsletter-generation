import axios from 'axios';
import { createWriteStream, unlink } from 'fs';
import { promisify } from 'util';
import path from 'path';
import sharp from 'sharp';

const unlinkAsync = promisify(unlink);

export const downloadImage = async (url: string, outputPath: string) => {
  try {
    // Download the image to the rawOutputPath.
    const rawOutputPath = outputPath + "_raw";
    const response = await axios.get(url, { responseType: 'stream' });
    const fileStream = createWriteStream(rawOutputPath);
    response.data.pipe(fileStream);
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve as any);
      fileStream.on('error', reject);
    });

    // Use sharp to resize the image. Here we set a max width of 100.
    // (Height is adjusted automatically to preserve aspect ratio.)
    await sharp(rawOutputPath)
      .resize({ width: 180 })
      .jpeg({ quality: 100 }) // Use JPEG with quality set to 80
      .toFile(outputPath);

    // Delete the raw downloaded image file.
    await unlinkAsync(rawOutputPath);

    return outputPath;
  } catch (error) {
    console.error(`❌❌ Error downloading or resizing image: ${(error as any).message}`);
    return Promise.reject((error as any).message);
  }
};
