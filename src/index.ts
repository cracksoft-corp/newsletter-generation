import * as fs from "fs/promises";
import { NewsletterEpisode } from "./models/content-input";
import { fetchAdditionalMusicDataAndImages } from "./music/music";
import { MusicItem } from "./models/content-input";


async function fetchExtraDataAndImages() {
  const contentRaw = await fs.readFile("episodes/13/content-input.json", "utf-8");
  const content = JSON.parse(contentRaw) as NewsletterEpisode;

  fetchAdditionalMusicDataAndImages(content.recommendations.music);

  // Optionally write back the updated content to a new file
  await fs.writeFile("content-updated.json", JSON.stringify(content, null, 2));
}

fetchExtraDataAndImages().then(() => {
  console.log(`Done!`);
});
