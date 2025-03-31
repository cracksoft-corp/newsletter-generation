import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { load } from 'cheerio';
import { downloadImage } from './images/download-image';
import { uploadImage } from './images/upload-image-to-kit';
import { WebItem } from './models/content-input';
import { OutputItem } from './models/content-output';
import puppeteer from 'puppeteer';

export async function fetchWebItems(episodeNumber: number, items: WebItem[], buttonText: string): Promise<OutputItem[]> {
    let results: OutputItem[] = [];
    for (const index in items) {
        const newsItem = items[index];
        const { title, description, imageUploadUrl } = await fetchOGMetadata(episodeNumber, parseInt(index), newsItem.url);
        let output: OutputItem = {
            type: "web",
            title,
            description,
            uploadedImageUrl: imageUploadUrl,
            url: newsItem.url,
            buttonBackgroundColour: "#000000",
            buttonTextColour: "#FFFFFF",
            buttonText: `<strong>${buttonText}</strong>`,
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
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="og:title"]').attr('content') ||
      '';
    let description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="og:description"]').attr('content') ||
      '';
    let ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      '';
    
    if (!ogImage || !description || !title) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      const html = await page.content();
      await browser.close();
      const $ = load(html);
      if (!ogImage) {
        ogImage =
          $('meta[property="og:image"]').attr('content') ||
          $('meta[name="og:image"]').attr('content') ||
          '';
      }
      if (!description) {
        description =
          $('meta[property="og:description"]').attr('content') ||
          $('meta[name="og:description"]').attr('content') ||
          '';
      }
      if (!title) {
        title =
          $('meta[property="og:title"]').attr('content') ||
          $('meta[name="og:title"]').attr('content') ||
          '';
      }
    }
      // if og:image is relative, use the base URL to resolve it to full url
    if (ogImage && !ogImage.startsWith('http')) {
      const baseUrl = new URL(url);
      ogImage = new URL(ogImage, baseUrl).href;
    }

    if (!ogImage) {
      console.error(`No Open Graph image found for URL: ${url}`);
      return { title, description, imageUploadUrl: "" };
    } else {
      const downloadPath = path.join("episodes", episodeNumber.toString(), "images", "news", `${newsIndexNumber}`);
      console.log(`Url to download is ${ogImage}`);
      const imagePath = await downloadImage(ogImage, downloadPath);
      const imageUploadUrl = await uploadImage(imagePath);
      return { title, description, imageUploadUrl };
    }
  } catch (error) {
    console.error('Error fetching metadata for url: ', url);
    fs.writeFileSync('error-log.txt', JSON.stringify(error, null, 2), { flag: 'a' });
    throw error;
  }
}
