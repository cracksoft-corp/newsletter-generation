import * as fs from "fs/promises";
import * as path from "path";
import { NewsletterEpisode } from "./models/content-input";
import { fetchAdditionalMusicDataAndImages } from "./music/music";
import { fetchAdditionalNewsInfo } from "./news/get-news";

const episodeArgument = process.argv[2];
if (!episodeArgument) {
  console.error("Usage: node dist/index.js <episode-number>");
  process.exit(1);
}// Validate that the episode number is a positive integer
const episodeNumber = parseInt(episodeArgument, 10);
if (isNaN(episodeNumber) || episodeNumber <= 0) {
  console.error("Error: Episode number must be a positive integer.");
  process.exit(1);
}

/**
 * Ensure that the necessary directories exist under episodes/<episodeNumber>.
 * Creates:
 *   episodes/<episodeNumber>/images
 *   episodes/<episodeNumber>/images/music
 *   episodes/<episodeNumber>/images/news
 */
async function ensureDirectories(episodeNumber: number): Promise<void> {
  const baseDir = path.join("episodes", episodeNumber.toString());
  const imagesDir = path.join(baseDir, "images");
  const musicDir = path.join(imagesDir, "music");
  const newsDir = path.join(imagesDir, "news");

  await fs.mkdir(musicDir, { recursive: true });
  await fs.mkdir(newsDir, { recursive: true });
}

async function fetchExtraDataAndImages() {
  await ensureDirectories(episodeNumber);
  const contentRaw = await fs.readFile(path.join("episodes", episodeNumber.toString(), "content-input.json"), "utf-8");
  let content = JSON.parse(contentRaw) as NewsletterEpisode;

  // if (content.recommendations.music && content.recommendations.music.length > 0) {
  //   console.log(`Fetching music data for ${content.recommendations.music.length} items...`);
  //   const updatedContent = await fetchAdditionalMusicDataAndImages(episodeNumber, content.recommendations.music);
  //   content.recommendations.music = updatedContent;
  // }
  if (content.news && content.news.length > 0) {
    console.log(`Fetching news data for ${content.news.length} items...`);
    content.news = await fetchAdditionalNewsInfo(episodeNumber, content.news);
  }

  // Optionally write back the updated content to a new file
  await fs.writeFile(path.join("episodes", episodeNumber.toString(), "content-output.json"), JSON.stringify(content, null, 2));
}

fetchExtraDataAndImages().then(() => {
  console.log(`Done!`);
});
