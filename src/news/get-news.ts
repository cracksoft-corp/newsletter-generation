import axios from 'axios';
import * as path from 'path';
import { load } from 'cheerio';
import { downloadImage } from '../images/download-image';
import { uploadImage } from '../images/upload-image-to-kit';
import { NewsItem } from '../models/content-input';
import { OutputItem } from '../models/content-output';
import tldts from 'tldts';
import { v4 as uuidv4 } from 'uuid';
import { newsProviderColours } from './colours';

export async function fetchAdditionalNewsInfo(episodeNumber: number, newsItems: NewsItem[]): Promise<OutputItem[]> {
    let results: OutputItem[] = [];
    for (const index in newsItems) {
        const newsItem = newsItems[index];
        const { title, description, imageUploadUrl } = await fetchOGMetadata(episodeNumber, parseInt(index), newsItem.url);
        const primaryDomain = getPrimaryDomain(newsItem.url);
        const newsProviderDetails = newsProviderColours.find((provider) => provider.newsDomain === primaryDomain);
        let output: OutputItem = {
            type: "web",
            title,
            description,
            uploadedImageUrl: imageUploadUrl,
            url: newsItem.url,
            buttonBackgroundColour: newsProviderDetails?.buttonBackgroundColour || "#000000",
            buttonTextColour: newsProviderDetails?.buttonTextColour || "#FFFFFF",
            buttonText: `Read on <strong>${newsProviderDetails?.newsProvider || primaryDomain}</strong>`,
        };
        results[index] = output;
    }
    return results;
}

export async function fetchOGMetadata(episodeNumber: number, newsIndexNumber: number, url: string): Promise<{title: string, description: string, imageUploadUrl: string}> {
  try {
    const { data: html } = await axios.get(url);
    const $ = load(html);

    // Fetch Open Graph metadata

    // Try property first, then fallback to name
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="og:title"]').attr('content') ||
      '';
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="og:description"]').attr('content') ||
      '';
    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      '';

      if (!ogImage) {
        console.error(`No Open Graph image found for URL: ${url}`);
        return { title, description, imageUploadUrl: "" };
      } else {
        const id = uuidv4();
        const downloadPath = path.join("episodes", episodeNumber.toString(), "images", "news", id);
        const imagePath = await downloadImage(ogImage, downloadPath);
        const imageUploadUrl = await uploadImage(imagePath);
        return { title, description, imageUploadUrl };
      }
  } catch (error) {
    console.error('Error fetching metadata:', JSON.stringify(error, null, 2));
    throw error;
  }
}

function getPrimaryDomain(url: string): string {
    const parsedUrl = tldts.parse(url);
    return parsedUrl.domain || "";
}
