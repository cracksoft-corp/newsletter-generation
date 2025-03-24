import * as fs from "fs/promises";
import * as path from "path";
import { MusicItem, MusicSection, NewsletterEpisode, TvAndFilmSection } from "./models/content-input";
import { fetchAdditionalMusicDataAndImages } from "./music/music";
import { fetchAdditionalNewsInfo } from "./news/get-news";
import { fetchAdditionalTvAndFilmDataAndImages } from "./tv_film/tv_film";

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
  const tvAndFilmDir = path.join(imagesDir, "tv_and_film");

  await fs.mkdir(musicDir, { recursive: true });
  await fs.mkdir(newsDir, { recursive: true });
  await fs.mkdir(tvAndFilmDir, { recursive: true });
}

async function fetchExtraDataAndImages() {
  await ensureDirectories(episodeNumber);
  const contentRaw = await fs.readFile(path.join("episodes", episodeNumber.toString(), "content-input.json"), "utf-8");
  let content = JSON.parse(contentRaw) as NewsletterEpisode;

  // const musicIndex = content.recommendations.findIndex((item) => item.sectionName === "music");
  // if (musicIndex !== -1 && content.recommendations[musicIndex].items.length > 0) {
  //   const musicSection = content.recommendations[musicIndex] as MusicSection;
  //   console.log(`Fetching music data for ${musicSection.items.length} items...`);
  //   const updatedContent = await fetchAdditionalMusicDataAndImages(episodeNumber, musicSection.items);
  //   content.recommendations[musicIndex].items = updatedContent;
  // }

  const tv_and_film_index = content.recommendations.findIndex((item) => item.sectionName === "tv_and_film");
  if (tv_and_film_index !== -1 && content.recommendations[tv_and_film_index].items.length > 0) {
    const tv_and_film_section = content.recommendations[tv_and_film_index] as TvAndFilmSection;
    console.log(`Fetching tv and film data for ${tv_and_film_section.items.length} items...`);
    const updatedContent = await fetchAdditionalTvAndFilmDataAndImages(episodeNumber, tv_and_film_section.items);
    content.recommendations[tv_and_film_index].items = updatedContent;
  }

  if (content.news && content.news.length > 0) {
    console.log(`Fetching news data for ${content.news.length} items...`);
    content.news = await fetchAdditionalNewsInfo(episodeNumber, content.news);
  }

  content["$schema"] = "../../content-output.schema.json";
  // Optionally write back the updated content to a new file
  await fs.writeFile(path.join("episodes", episodeNumber.toString(), "content-output.json"), JSON.stringify(content, null, 2));
}

fetchExtraDataAndImages().then(() => {
  console.log(`Done!`);
});
