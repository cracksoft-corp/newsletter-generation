// Define types for Spotify responses (simplified)
export interface SpotifyImage {
  height: number;
  width: number;
  url: string;
}

export interface SpotifyArtistAttributes {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  // ... additional fields if needed
}

export interface SpotifyAlbumAttributes {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
  // ... additional fields if needed
}

// Get environment variables for Spotify credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify client ID or secret in environment variables.");
}

/**
 * Get a Spotify access token using the client credentials flow.
 */
export async function getSpotifyAccessToken(): Promise<string> {
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials"
  });
  const data = await response.json() as any;
  if (!data.access_token) {
    throw new Error("Failed to retrieve Spotify access token");
  }
  return data.access_token;
}

/**
 * Fetch a Spotify artist by name.
 */
export async function getSpotifyArtist(token: string, artist: string): Promise<SpotifyArtistAttributes> {
  const endpoint = `https://api.spotify.com/v1/search?query=${encodeURIComponent(artist)}&type=artist&limit=1`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json() as { artists: {items: SpotifyArtistAttributes[]} };
    if (!data.artists || data.artists.items.length === 0) {
      throw new Error("No artists found on Spotify");
    }
    return data.artists.items[0];
  } catch (error) {
    throw new Error("Error fetching Spotify artist for: " + artist);
  }
}

/**
 * Fetch a Spotify album by artist and album name.
 * Uses a query formatted as: album:"Album Name" artist:"Artist Name"
 */
export async function getSpotifyAlbum(token: string, artist: string, album: string): Promise<SpotifyAlbumAttributes> {
  const query = `album:"${album}" artist:"${artist}"`;
  const endpoint = `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=album&limit=1`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json() as { albums: {items: SpotifyAlbumAttributes[]} };
    if (!data.albums || data.albums.items.length === 0) {
      console.error("No album found on Spotify for:", album, artist);
      throw new Error("No album found on Spotify");
    }
    return data.albums.items[0];
  } catch (error) {
    console.error("Error fetching Spotify album:", error);
    throw new Error("Error fetching Spotify album for: " + album);
  }
}

/**
 * Extract the Spotify external URL from an artist or album.
 */
export function getSpotifyItemUrl(item: SpotifyArtistAttributes | SpotifyAlbumAttributes): string {
  return item.external_urls.spotify;
}

/**
 * Extract an artwork URL from a Spotify artist or album.
 * Chooses the first (usually the largest) image.
 */
export function getSpotifyArtworkUrl(item: SpotifyArtistAttributes | SpotifyAlbumAttributes): string {
  if (item.images && item.images.length > 0) {
    return item.images[0].url;
  }
  return "";
}
