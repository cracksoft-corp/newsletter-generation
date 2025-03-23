export interface YouTubeChannelAttributes {
    id: {
      channelId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
      // Additional snippet fields can be added if needed
    };
  }
  
  export interface YouTubePlaylistAttributes {
    id: {
      playlistId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
  }
  
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YouTube API Key in environment variables (YOUTUBE_API_KEY).");
  }
  
  /**
   * Fetches a YouTube channel for a given artist.
   * It uses the search endpoint with type=channel.
   */
  export async function getYouTubeArtistChannel(artist: string): Promise<YouTubeChannelAttributes> {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(artist)}&key=${apiKey}&maxResults=1`;
    
    const response = await fetch(endpoint);
    const data = await response.json() as any;
    if (!data.items || data.items.length === 0) {
      throw new Error(`No YouTube channels found for artist: ${artist}`);
    }
  
    return data.items[0] as YouTubeChannelAttributes;
  }
  
  /**
   * Fetches a YouTube playlist representing an album.
   * Since YouTube doesn’t have an album resource, we search for a playlist.
   * The query is constructed as: "artist album album" to improve the relevance.
   */
  export async function getYouTubeAlbumPlaylist(artist: string, album: string): Promise<YouTubePlaylistAttributes> {
    const query = `${artist} ${album} album`;
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1`;
  
    const response = await fetch(endpoint);
    const data = await response.json() as any;
    if (!data.items || data.items.length === 0) throw new Error(`No album playlist found for: ${artist} - ${album}`);
    return data.items[0] as YouTubePlaylistAttributes;
  }
  
  /**
   * Utility function to extract the channel URL from a channel result.
   * For a channel, the URL format is usually: https://www.youtube.com/channel/<channelId>
   */
  export function getYouTubeChannelUrl(channel: YouTubeChannelAttributes): string {
    return `https://www.youtube.com/channel/${channel.id.channelId}`;
  }
  
  /**
   * Utility function to extract the playlist URL from a playlist result.
   * The URL format is: https://www.youtube.com/playlist?list=<playlistId>
   */
  export function getYouTubePlaylistUrl(playlist: YouTubePlaylistAttributes): string {
    return `https://www.youtube.com/playlist?list=${playlist.id.playlistId}`;
  }
