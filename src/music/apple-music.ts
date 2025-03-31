import { AlbumAttributes, AppleMusicSearchResponse, ArtistAttributes } from "../models/apple-music-search";
const developerToken = process.env.APPLE_MUSIC_TOKEN;

const headers = {
  authorization: `Bearer ${developerToken}`,
  "accept-language": "en-US,en;q=0.9",
  origin: "https://music.apple.com",
}

export async function fetchAppleMusicArtist(artist: string): Promise<ArtistAttributes> {
  const endpoint = `https://api.music.apple.com/v1/catalog/gb/search?term=${encodeURIComponent(artist)}&limit=1&types=artists`;
  try {
    const response = await fetch(endpoint, { headers });      
    const responseData = await response.json() as AppleMusicSearchResponse;
    if (!(responseData.results.artists && responseData.results.artists.data.length > 0)) {
      console.error("No artists found in Apple Music search results for term: ", artist);
      throw new Error("No artists found in Apple Music search results");
    }
    return responseData.results.artists.data[0].attributes;
  } catch (error) {
    console.error("Error fetching Apple Music link:", error);
    throw new Error("Error fetching Apple Music link for artist: " + artist);
  }
}

export function getItemUrl(item: AlbumAttributes | ArtistAttributes): string {
  return item.url;
}

export function getArtworkUrl(item: AlbumAttributes | ArtistAttributes): string {
  return item.artwork.url.replace("{w}", "150").replace("{h}", "150");
}

export async function fetchAppleMusicAlbum(artist: string, album:string): Promise<AlbumAttributes> {
  const searchTerm = `${artist} ${album}`;
  const endpoint = `https://api.music.apple.com/v1/catalog/gb/search?term=${encodeURIComponent(searchTerm)}&limit=1&types=albums`;
  try {
    const response = await fetch(endpoint, { headers });
    const responseData = await response.json() as AppleMusicSearchResponse;
    if (!(responseData.results.albums && responseData.results.albums.data.length > 0)) {
      console.error("❌ No artists found in Apple Music search results for term: ", artist);
      throw new Error("No artists found in Apple Music search results");
    }
    return responseData.results.albums.data[0].attributes;
  } catch (error) {
    console.error("❌❌❌ Error fetching Apple Music link:", error);
    throw new Error("Error fetching Apple Music link for artist: " + artist);
  }
}

/**
 * Helper function that strips HTML tags for character counting.
 */
function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, "");
}

/**
 * Generate a tweet-sized editorial summary:
 * - If `standard` exists, we try to build a summary from whole sentences.
 * - We keep HTML tags in the output, but when counting characters, we use the stripped version.
 * - We include whole sentences as long as the total stripped length stays under 150.
 * - We stop when adding another sentence would exceed 150 characters (if we've already reached at least 80 characters).
 * - If standard is missing, we fall back to short.
 */
export function getEditorialSummary(editorialNotes: {
  standard?: string;
  short?: string;
}): string {
  if (editorialNotes && editorialNotes.standard) {
    const original = editorialNotes.standard;
    // Split into sentences. (This is a simple split; for more complex HTML, you may need a proper parser.)
    const sentences = original.split(/(?<=[.!?])\s+/);
    let summary = "";
    let summaryStripped = "";
    
    for (const sentence of sentences) {
      const sentenceStripped = stripHtml(sentence).trim();
      if (!sentenceStripped) continue;
      
      // Calculate the new length if we add this sentence
      const potentialStripped = summaryStripped
        ? (summaryStripped + " " + sentenceStripped).trim()
        : sentenceStripped;
      
      if (potentialStripped.length <= 280) {
        summary = summary ? summary + " " + sentence : sentence;
        summaryStripped = potentialStripped;
      } else {
        // Adding this sentence would exceed 150 characters.
        // If we already have at least 80, then we stop.
        if (summaryStripped.length >= 120) {
          break;
        } else {
          // Otherwise, include this sentence even if it exceeds 150.
          summary = summary ? summary + " " + sentence : sentence;
          summaryStripped = potentialStripped;
          break;
        }
      }
    }
    
    // Optionally, if summaryStripped still exceeds 150 characters, you may want to truncate further.
    // That requires a more advanced solution that preserves HTML structure.
    return summary;
  } else if (editorialNotes && editorialNotes.short) {
    return editorialNotes.short;
  }
  return "";
}
