import axios from 'axios';
import { createWriteStream } from 'fs';

/**
 * Downloads an image from a given URL and saves it to a specified local path.
 * @param url The image URL
 * @param outputPath The local file path where the image should be saved
 */
export const downloadImage = async (url: string, outputPath: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const fileStream = createWriteStream(outputPath);
    response.data.pipe(fileStream);
    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        resolve(outputPath);
      });
      fileStream.on('error', (error) => {
        reject(error.message);
      });
    });
  } catch (error) {
    console.error(`❌❌ Error downloading image: ${(error as Error).message}`);
    return Promise.reject((error as Error).message);
  }
};
