import * as fs from "fs/promises";
import * as path from "path";
import { NewsletterEpisodeOutput } from "./models/content-output";
import { Liquid } from 'liquidjs';
import { html } from "cheerio/dist/commonjs/static";

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
    console.log(`Broadcast email HTML generated at: ${outputPath}`);
    // const broadcastEmail = {
    //     api_key: process.env.KIT_API_KEY,
    //     subject: `The latest episode of the newsletter is out!`,
    // }
    
}

createBroadcastEmail();
