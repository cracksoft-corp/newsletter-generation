const axios = require('axios');
const path = require('path');

// Check for required API key
const KIT_API_KEY = process.env.KIT_API_KEY;
if (!KIT_API_KEY) {
  throw new Error("Missing KIT_API_KEY in environment variables.");
}

// Process command-line arguments: node updateSubscriber.js <UserID> <preferredMusicProdiver> <preferredPodcastPlatform>
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Usage: node updateSubscriber.js <UserID> <preferredMusicProdiver> <preferredPodcastPlatform>");
  process.exit(1);
}

const [ userId, preferredMusicProdiver, preferredPodcastPlatform ] = args;

// Validate values
const validMusicProviders = ["apple", "spotify", "youtube", "none"];
const validPodcastPlatforms = ["web", "apple", "spotify", "none"];

if (!validMusicProviders.includes(preferredMusicProdiver.toLowerCase())) {
  console.error(`Invalid preferredMusicProdiver. Must be one of: ${validMusicProviders.join(', ')}`);
  process.exit(1);
}

if (!validPodcastPlatforms.includes(preferredPodcastPlatform.toLowerCase())) {
  console.error(`Invalid preferredPodcastPlatform. Must be one of: ${validPodcastPlatforms.join(', ')}`);
  process.exit(1);
}

// Construct the payload to update custom fields
const payload = {
  fields: {
    preferred_music_platform: preferredMusicProdiver.toLowerCase(),
    preferred_podcast_platform: preferredPodcastPlatform.toLowerCase()
  }
};

// Build the endpoint URL (using the API key as a query param as well)
const endpoint = `https://api.kit.com/v4/subscribers/${userId}`;

async function updateSubscriber() {
  try {
    console.log(`Updating subscriber ${userId} with preferred music provider: ${preferredMusicProdiver} and podcast platform: ${preferredPodcastPlatform}`);
    console.log(`payload: `, payload);
    const response = await axios.patch(endpoint, payload, {
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        "Authorization": `Bearer ${KIT_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    console.log('Subscriber updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw error;
  }
}

updateSubscriber();
