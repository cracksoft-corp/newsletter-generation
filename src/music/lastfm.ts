const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
if (!LASTFM_API_KEY) {
  throw new Error("Missing LastFM API key in environment variables.");
}

// Define interfaces for the data you expect to receive
export interface LastFmArtistBio {
  summary: string;
  content: string;
  published?: string;
}

export interface LastFmArtistInfo {
  name: string;
  bio: LastFmArtistBio;
  // ... add more fields if needed
}

export interface LastFmAlbumWiki {
  summary: string;
  content: string;
  published?: string;
}

export interface LastFmAlbumInfo {
  album: {
    name: string;
    artist: string;
    wiki?: LastFmAlbumWiki;
    // ... add more fields if needed
  };
}

/**
 * Fetch editorial notes (biography) for an artist from Last.fm.
 * Returns a LastFmArtistInfo object.
 */
export async function getLastFmArtistInfo(artist: string): Promise<string> {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo`
    + `&artist=${encodeURIComponent(artist)}`
    + `&api_key=${LASTFM_API_KEY}`
    + `&format=json`;
  
  const response = await fetch(endpoint);
  const data = await response.json() as { error?: any, message: string, artist: LastFmArtistInfo };
  if (data.error) throw new Error(`Last.fm error: ${data.message}`);
  // The response is expected to have an "artist" property
  return getTweetSizedSummary(data.artist?.bio?.content);
}

/**
 * Fetch editorial notes (wiki) for an album from Last.fm.
 * Returns a LastFmAlbumInfo object.
 */
export async function getLastFmAlbumInfo(artist: string, album: string): Promise<string> {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo`
    + `&artist=${encodeURIComponent(artist)}`
    + `&album=${encodeURIComponent(album)}`
    + `&api_key=${LASTFM_API_KEY}`
    + `&format=json`;
  
  const response = await fetch(endpoint);
  const data = await response.json() as any;
  if (data.error) throw new Error(`Last.fm error: ${data.message}`);
  // The response is expected to have an "album" property
  return getTweetSizedSummary(data.album?.wiki?.summary);
}


/**
 * Helper function to remove HTML tags.
 */
function stripHtml(text: string): string {
    return text.replace(/<[^>]+>/g, "");
  }
  
  /**
   * Generates a tweet-sized summary from the input content.
   * The output retains HTML tags, but the visible character count is measured without them.
   * 
   * The summary is built sentence by sentence until the stripped version is at least MIN_LENGTH
   * and adding another sentence would exceed MAX_LENGTH. If the final stripped summary is too short,
   * it falls back to the full content.
   *
   * @param content The full editorial content with HTML.
   * @returns A tweet-sized summary (80-150 visible characters).
   */
  export function getTweetSizedSummary(content: string): string {
    const MIN_LENGTH = 80;
    const MAX_LENGTH = 150;
    
    // Split content into sentences (this is a simple approach)
    const sentences = content.split(/(?<=[.!?])\s+/);
    let summary = "";
    let summaryStripped = "";
    
    for (const sentence of sentences) {
      const sentenceStripped = stripHtml(sentence).trim();
      if (!sentenceStripped) continue;
      
      // Calculate potential new stripped summary
      const potentialStripped = summaryStripped 
        ? (summaryStripped + " " + sentenceStripped).trim() 
        : sentenceStripped;
      
      if (potentialStripped.length <= MAX_LENGTH) {
        summary = summary ? summary + " " + sentence : sentence;
        summaryStripped = potentialStripped;
      } else {
        // If adding the full sentence would exceed MAX_LENGTH, only add part of it if we haven't reached MIN_LENGTH
        if (summaryStripped.length >= MIN_LENGTH) {
          break;
        } else {
          const remaining = MAX_LENGTH - summaryStripped.length - 1; // minus one for the space
          if (remaining > 0) {
            const trimmedSentence = sentenceStripped.substring(0, remaining).trim();
            summary = summary ? summary + " " + trimmedSentence : trimmedSentence;
            summaryStripped = (summaryStripped + " " + trimmedSentence).trim();
          }
          break;
        }
      }
    }
    
    // Fallback: if summary is still too short, return the full content.
    if (summaryStripped.length < MIN_LENGTH) {
      return content;
    }
    
    return summary;
  }
