import axios from 'axios';
import { createWriteStream } from 'fs';

/**
 * Downloads an image from a given URL and saves it to a specified local path.
 * @param url The image URL
 * @param outputPath The local file path where the image should be saved
 */
export const downloadImage = async (url: string, outputPath: string): Promise<void> => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const fileStream = createWriteStream(outputPath);
    response.data.pipe(fileStream);
    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        console.log(`✅ Image saved to: ${outputPath}`);
        resolve();
      });
      fileStream.on('error', (error) => {
        console.error(`❌ Error writing file: ${error.message}`);
        reject(error);
      });
    });
  } catch (error) {
    console.error(`❌ Error downloading image: ${(error as Error).message}`);
  }
};
