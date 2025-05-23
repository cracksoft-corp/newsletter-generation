import { OutputItem } from "../models/content-output";
import { TvAndFilmItem } from "../models/content-input";
import axios from "axios";
import { load } from "cheerio";
import * as path from "path";
import * as fs from "fs";
import { downloadImage } from "../images/download-image";
import { uploadImage } from "../images/upload-image-to-kit";
import tldts from "tldts";
import { mediaProviderColours } from "./colours";
import { v4 as uuidv4 } from "uuid";

export async function fetchAdditionalTvAndFilmDataAndImages(episodeNumber: number, tvItems: TvAndFilmItem[]): Promise<OutputItem[]> {
    let results: OutputItem[] = [];
    for (const index in tvItems) {
        const item = tvItems[index];
        let logOutput = `\tFetching data for ${item.title}`;
        let output: OutputItem;
        let openGraphData = await fetchOGMetadata(episodeNumber, parseInt(index), item.url);
        let primaryDomain = getPrimaryDomain(item.url);
        let mediaDetails = mediaProviderColours.find((mediaProvider) => mediaProvider.mediaDomain === primaryDomain)!;
        output = {
            type: "tv_and_film",
            title: item.title,
            url: item.url,
            description: openGraphData.description,
            uploadedImageUrl: openGraphData.imageUploadUrl,
            buttonText: `Watch on <strong>${mediaDetails.mediaProvider}</strong>`,
            buttonBackgroundColour: mediaDetails.buttonBackgroundColour,
            buttonTextColour: mediaDetails.buttonTextColour,
        };
        console.log(logOutput);
        results.push(output);
    }
    return results;
}

export async function fetchOGMetadata(episodeNumber: number, tvIndexNumber: number, url: string): Promise<{title: string, description: string, imageUploadUrl: string}> {
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

      console.log(`Fetched html for url ${url}\n\ttitle: ${title}\n\tdescription: ${description}\n\togImage: ${ogImage}`);
  
      let id = uuidv4();
      const downloadPath = path.join("episodes", episodeNumber.toString(), "images", "tv_and_film", id);
      if (!ogImage) {
        console.error(`No Open Graph image found for URL: ${url}`);
        return { title, description, imageUploadUrl: "" };
      } else {
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
  
  function getPrimaryDomain(url: string): string {
      const parsedUrl = tldts.parse(url);
      return parsedUrl.domain || "";
  }
  