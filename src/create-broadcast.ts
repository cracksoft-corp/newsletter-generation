import * as fs from "fs/promises";
import * as path from "path";
import { NewsletterEpisodeOutput } from "./models/content-output";
import { Liquid } from 'liquidjs';
import axios from "axios";
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

const KIT_API_KEY = process.env.KIT_API_KEY;
if (!KIT_API_KEY) {
  throw new Error("Missing KIT_API_KEY in environment variables.");
}

async function createBroadcastEmail() {
    const contentRaw = await fs.readFile(path.join("episodes", episodeNumber.toString(), "content-output.json"), "utf-8");
    const content = JSON.parse(contentRaw) as NewsletterEpisodeOutput;
    const htmlTemplate = await fs.readFile("template.html", "utf-8");
    const engine = new Liquid();
    const renderedHtml = await engine.parseAndRender(htmlTemplate, content);
    const outputPath = path.join("episodes", episodeNumber.toString(), "broadcast-email.html");
    await fs.writeFile(outputPath, renderedHtml, "utf-8");

    const episodeCoverUrl = await uploadImage(path.join("episodes", episodeNumber.toString(), "episode_cover_large.jpg"));
    console.log(`Broadcast email HTML generated at: ${outputPath}`);
    const response = await axios.post("https://api.kit.com/v4/broadcasts",
        {
          "email_address": null,
          "content": renderedHtml,
          "description": content.episode.title,
          "public": false, // don't make public
          "send_at" : null, // don't send. Check first.
          "published_at": null,
          "thumbnail_alt": `${content.episode.title} inspired episode cover art`,
          "thumbnail_url": episodeCoverUrl,
          "preview_text": content.intro,
          "subject": `ep.${content.episode.number} · ${content.episode.title}`,
          "subscriber_filter": [
          ]
        },
        {
          headers: {
            'X-Kit-Api-Key': KIT_API_KEY,
            "Authorization": `Bearer ${KIT_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );
    console.log(`Response: ${response.status}`);
    const responseJSON = response.data;
    console.log(`Response JSON: `, responseJSON);
}

createBroadcastEmail();
