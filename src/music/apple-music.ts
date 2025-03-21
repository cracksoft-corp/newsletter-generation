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

export async function getItemUrl(item: AlbumAttributes | ArtistAttributes): Promise<string> {
  return item.url;
}

export async function getArtworkUrl(item: AlbumAttributes | ArtistAttributes): Promise<string> {
  return item.artwork.url.replace("{w}", "150").replace("{h}", "150");
}

export async function fetchAppleMusicAlbum(artist: string, album:string): Promise<AlbumAttributes> {
  const searchTerm = `${artist} ${album}`;
  const endpoint = `https://api.music.apple.com/v1/catalog/gb/search?term=${encodeURIComponent(searchTerm)}&limit=1&types=albums`;
  try {
    const response = await fetch(endpoint, { headers });
    const responseData = await response.json() as AppleMusicSearchResponse;
    if (!(responseData.results.albums && responseData.results.albums.data.length > 0)) {
      console.error("No artists found in Apple Music search results for term: ", artist);
      throw new Error("No artists found in Apple Music search results");
    }
    return responseData.results.albums.data[0].attributes;
  } catch (error) {
    console.error("Error fetching Apple Music link:", error);
    throw new Error("Error fetching Apple Music link for artist: " + artist);
  }
}

export async function getAppleMusicAlbumEditorialNotes(album: AlbumAttributes): Promise<string> {
  if (!album.editorialNotes) {
    return "";
  }
  if (album.editorialNotes.short) {
    return album.editorialNotes.short;
  }
  if (album.editorialNotes.standard) {
    if (album.editorialNotes.standard.length > 350) {
      return album.editorialNotes.standard.split(".")[0];
    }
    return album.editorialNotes.standard; // todo: split if too long?
  }
  return "";
}
