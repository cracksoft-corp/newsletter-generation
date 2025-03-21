import path from 'path';
import { downloadImage } from '../download-image';
import { MusicItem } from '../models/content-input';
import { MusicItemOutput } from '../models/content-output';
import { fetchAppleMusicAlbum, getItemUrl, getArtworkUrl, fetchAppleMusicArtist, getAppleMusicAlbumEditorialNotes } from './apple-music';

export async function fetchAdditionalMusicDataAndImages(musicItems: MusicItem[]): Promise<MusicItemOutput[]> {
    let results: MusicItemOutput[] = [];
    for (const index in musicItems) {
        const item = musicItems[index];
        const type = item.album ? "album" : "artist";
        const searchTerm = item.album ? `${item.artist} ${item.album}` : item.artist;
        console.log(`Fetching data for ${searchTerm}`);
        let output: MusicItemOutput;
        if (type == "artist") {
            const artist = await fetchAppleMusicArtist(item.artist);
            const url = await getItemUrl(artist);
            const artworkUrl = await getArtworkUrl(artist);
            console.log(`artwork url: `, artworkUrl);
            const downloadPath = path.join(__dirname, `../../episodes/13/images/music/${index}.png`)
            console.log(`Download path: `, downloadPath);
            downloadImage(artworkUrl, downloadPath);
            // upload image to Kit
            // get spotify artist description or wikipedia or something else.
            // get spotify link
            // get YT link
            output = {
                artist: item.artist,
                description: artist.genreNames.join(", "),
                uploadedImageUrl: artworkUrl,
                links: [{ platform: "Apple Music", url }],
            };
        } else {
            const album = await fetchAppleMusicAlbum(item.artist, item.album!);
            const url = await getItemUrl(album);
            const artworkUrl = await getArtworkUrl(album);
            const description = await getAppleMusicAlbumEditorialNotes(album);
            const downloadPath = path.join(__dirname, `../../episodes/13/images/music/${index}.png`)
            downloadImage(artworkUrl, downloadPath);
            // upload image to Kit
            // get spotify link
            // get YT link
            output = {
                artist: item.artist,
                album: item.album,
                description,
                uploadedImageUrl: artworkUrl,
                links: [{ platform: "Apple Music", url }],
            };
        }
        results[index] = output;
    }
    return results;
}
