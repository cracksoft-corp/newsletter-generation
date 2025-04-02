import * as fs from "fs/promises";
import * as path from "path";
import { BooksSection, MusicSection, NewsletterEpisode, TvAndFilmSection, WebItem } from "./models/content-input";
import { fetchAdditionalMusicDataAndImages } from "./music/music";
import { fetchAdditionalNewsInfo } from "./news/get-news";
import { fetchAdditionalTvAndFilmDataAndImages } from "./tv_film/tv_film";
import { getBooks } from "./books/get-books";
import { NewsletterEpisodeOutput, OutputItem } from "./models/content-output";
import { fetchWebItems } from "./get-web-item";
import { uploadImage } from "./images/upload-image-to-kit";

const episodeArgument = process.argv[2];
if (!episodeArgument) {
  console.error("Usage: node dist/fetch-data.js <episode-number>");
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
  const manualDir = path.join(imagesDir, "manual_images");
  const newsDir = path.join(imagesDir, "news");
  const tvAndFilmDir = path.join(imagesDir, "tv_and_film");
  const books = path.join(imagesDir, "books");
  const web = path.join(imagesDir, "web");

  await fs.mkdir(musicDir, { recursive: true });
  await fs.mkdir(manualDir, { recursive: true });
  await fs.mkdir(newsDir, { recursive: true });
  await fs.mkdir(tvAndFilmDir, { recursive: true });
  await fs.mkdir(books, { recursive: true });
  await fs.mkdir(web, { recursive: true });
}

async function fetchExtraDataAndImages() {
  await ensureDirectories(episodeNumber);
  const contentRaw = await fs.readFile(path.join("episodes", episodeNumber.toString(), "content-input.json"), "utf-8");
  let content = JSON.parse(contentRaw) as NewsletterEpisode;
  let output = JSON.parse(contentRaw) as NewsletterEpisodeOutput;

  const musicIndex = content.recommendations.findIndex((item) => item.sectionName === "music");
  if (musicIndex !== -1 && content.recommendations[musicIndex].items.length > 0) {
    const musicSection = content.recommendations[musicIndex] as MusicSection;
    console.log(`Fetching music data for ${musicSection.items.length} items...`);
    const updatedContent = await fetchAdditionalMusicDataAndImages(episodeNumber, musicSection.items);
    output.recommendations[musicIndex].items = updatedContent;
  }

  output["$schema"] = "../../content-output.schema.json";
  const episodeCoverUrl = await uploadImage(path.join("episodes", episodeNumber.toString(), "episode_cover_small.jpg"));
  output.episode.episodeCoverUrl = episodeCoverUrl;

  // Add link to the newsletter archive.

  const tv_and_film_index = content.recommendations.findIndex((item) => item.sectionName === "tv_and_film");
  if (tv_and_film_index !== -1 && content.recommendations[tv_and_film_index].items.length > 0) {
    const tv_and_film_section = content.recommendations[tv_and_film_index] as TvAndFilmSection;
    console.log(`Fetching tv and film data for ${tv_and_film_section.items.length} items...`);
    const updatedContent = await fetchAdditionalTvAndFilmDataAndImages(episodeNumber, tv_and_film_section.items);
    output.recommendations[tv_and_film_index].items = updatedContent;
  }

  if (content.news && content.news.length > 0) {
    console.log(`Fetching news data for ${content.news.length} items...`);
    output.news = await fetchAdditionalNewsInfo(episodeNumber, content.news);
  }

  const books_index = content.recommendations.findIndex((item) => item.sectionName === "books");
  if (books_index !== -1 && content.recommendations[books_index].items.length > 0) {
    const books_section = content.recommendations[books_index] as BooksSection;
    console.log(`Fetching book data for ${books_section.items.length} items...`);
    const updatedContent = await getBooks(episodeNumber, books_section.items);
    output.recommendations[books_index].items = updatedContent as OutputItem[];
  }

  const tech_index = content.recommendations.findIndex((item) => item.sectionName === "tech");
  if (tech_index !== -1 && content.recommendations[tech_index].items.length > 0) {
    const tech_section = content.recommendations[tech_index] as BooksSection;
    console.log(`Fetching book data for ${tech_section.items.length} items...`);
    const updatedContent = await fetchWebItems(episodeNumber, tech_section.items as any, "Learn More");
    output.recommendations[tech_index].items = updatedContent as OutputItem[];
  }

  const podcasts_index = content.recommendations.findIndex((item) => item.sectionName === "podcasts");
  if (podcasts_index !== -1 && content.recommendations[podcasts_index].items.length > 0) {
    const podcasts_section = content.recommendations[podcasts_index];
    console.log(`Fetching podcast data for ${podcasts_section.items.length} items...`);
    const podcasts = await fetchWebItems(episodeNumber, podcasts_section.items as WebItem[], "Listen");
    output.recommendations[podcasts_index].items = podcasts;
  }
  
  const related_topic_index = content.recommendations.findIndex((item) => item.sectionName === "relatedTopic");
  if (related_topic_index !== -1 && content.recommendations[related_topic_index].items.length > 0) {
    const related_topic_section = content.recommendations[related_topic_index];
    console.log(`Fetching related topic data for ${related_topic_section.items.length} items...`);
    for (const idx in related_topic_section.items) {
      const item = related_topic_section.items[idx] as any;
      if (item.type === "book") {
        const book = (await getBooks(episodeNumber, [item]))[0];
        output.recommendations[related_topic_index].items[idx] = book;
      }
      if (item.type === "tv_and_film") {
        const tv_and_film = (await fetchAdditionalTvAndFilmDataAndImages(episodeNumber, [item]))[0];
        output.recommendations[related_topic_index].items[idx] = tv_and_film;
      }
      if (item.type === "podcast") {
        const podcast = (await fetchWebItems(episodeNumber, [item], "Listen"))[0];
        output.recommendations[related_topic_index].items[idx] = podcast;
      }
      if (item.type === "web") {
        const web_item = (await fetchWebItems(episodeNumber, [item], "Visit"))[0];
        output.recommendations[related_topic_index].items[idx] = web_item;
      }
      // fetch proper details for YouTube links
      if (item.type === "video") {
        const web_item = (await fetchWebItems(episodeNumber, [item], "Watch"))[0];
        output.recommendations[related_topic_index].items[idx] = web_item;
      }
    }
  }

  output.images = {
    "web_play": "https://embed.filekitcdn.com/e/tzG41MtqqwK7WM4ibRaugU/f6u88h81rWLFhFZJHUosWh/email",
    "apple_podcasts": "https://embed.filekitcdn.com/e/tzG41MtqqwK7WM4ibRaugU/5gNMKHJ1BM8v5VMvVp31Fc/email",
    "apple_music": "https://embed.filekitcdn.com/e/tzG41MtqqwK7WM4ibRaugU/hXevMxeUeuPu7HKu25WzGK/email",
    "spotify": "https://embed.filekitcdn.com/e/tzG41MtqqwK7WM4ibRaugU/i5xxskaPrp8mgjxGE4sXBz/email",
    "youtube_music": "https://embed.filekitcdn.com/e/tzG41MtqqwK7WM4ibRaugU/yKkaciMX9VkhtS37udSLL/email"
  };
  // Optionally write back the updated content to a new file
  await fs.writeFile(path.join("episodes", episodeNumber.toString(), "content-output.json"), JSON.stringify(output, null, 2));
}

fetchExtraDataAndImages().then(() => {
  console.log(`Done!`);
});
