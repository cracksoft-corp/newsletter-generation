import path from 'path';
import { downloadImage } from '../images/download-image';
import { uploadImage } from '../images/upload-image-to-kit';
import { MusicItem } from '../models/content-input';
import { MusicItemOutput } from '../models/content-output';
import { fetchAppleMusicAlbum, getItemUrl, getArtworkUrl, fetchAppleMusicArtist, getEditorialSummary } from './apple-music';
import { getSpotifyAccessToken, getSpotifyArtist, getSpotifyItemUrl, getSpotifyAlbum } from './spotify';
import { getYouTubeArtistChannel, getYouTubeChannelUrl, getYouTubeAlbumPlaylist, getYouTubePlaylistUrl } from './youtube';
import { getLastFmAlbumInfo, getLastFmArtistInfo } from './lastfm';

export async function fetchAdditionalMusicDataAndImages(episodeNumber: number, musicItems: MusicItem[]): Promise<MusicItemOutput[]> {
    let results: MusicItemOutput[] = [];
    const spotifyToken = await getSpotifyAccessToken();
    for (const index in musicItems) {
        const item = musicItems[index];
        const type = item.album ? "album" : "artist";
        const searchTerm = item.album ? `${item.artist} ${item.album}` : item.artist;
        let logOutput = `\tFetching data for ${searchTerm}`;
        let output: MusicItemOutput;
        if (type == "artist") {
            const artist = await fetchAppleMusicArtist(item.artist);
            const appleMusicUrl = getItemUrl(artist);
            const artworkUrl = getArtworkUrl(artist);
            logOutput += `\n\t\tartwork url: ${artworkUrl}`;
            const downloadPath = path.join("episodes", episodeNumber.toString(), "images", "music", `${index}.png`)
            const imagePath = await downloadImage(artworkUrl, downloadPath);
            const uploadedImageUrl = await uploadImage(imagePath);
            logOutput += `\n\t\t✅ Image uploaded to: ${uploadedImageUrl}`;
            const spotifyArtist = await getSpotifyArtist(spotifyToken, item.artist);
            const spotifyUrl = getSpotifyItemUrl(spotifyArtist);
            const youtubeArtistChannel = await getYouTubeArtistChannel(item.artist);
            const youtubeUrl = getYouTubeChannelUrl(youtubeArtistChannel);
            const lastFmDescription = await getLastFmArtistInfo(item.artist);
            // upload image to Kit
            output = {
                artist: item.artist,
                description: lastFmDescription || artist.genreNames.join(", "),
                uploadedImageUrl,
                links: [
                    { platform: "Apple Music", url: appleMusicUrl },
                    { platform: "Spotify", url: spotifyUrl },
                    { platform: "YouTube", url: youtubeUrl }],
            };
        } else {
            const album = await fetchAppleMusicAlbum(item.artist, item.album!);
            const appleMusicUrl = getItemUrl(album);
            const artworkUrl = getArtworkUrl(album);
            logOutput += `\n\t\tartwork url: ${artworkUrl}`;
            const appleMusicEditorialNote = await getEditorialSummary(album.editorialNotes as any);
            const downloadPath = path.join("episodes", episodeNumber.toString(), "images", "music", `${index}.png`)
            const imagePath = await downloadImage(artworkUrl, downloadPath);
            const uploadedImageUrl = await uploadImage(imagePath);
            logOutput += `\n\t\t✅ Image uploaded to: ${uploadedImageUrl}`;
            const spotifyAlbum = await getSpotifyAlbum(spotifyToken, item.artist, item.album!);
            const spotifyUrl = getSpotifyItemUrl(spotifyAlbum);
            const youtubeAlbumPlaylist = await getYouTubeAlbumPlaylist(item.artist, item.album!);
            const youtubeUrl = getYouTubePlaylistUrl(youtubeAlbumPlaylist);
            const lastFmDescription = await getLastFmAlbumInfo(item.artist, item.album!);
            // upload image to Kit
            output = {
                artist: item.artist,
                album: item.album,
                description: appleMusicEditorialNote || lastFmDescription,
                uploadedImageUrl,
                links: [
                    { platform: "Apple Music", url: appleMusicUrl },
                    { platform: "Spotify", url: spotifyUrl },
                    { platform: "YouTube", url: youtubeUrl },
                ],
            };
        }
        console.log(logOutput);
        results[index] = output;
    }
    return results;
}
