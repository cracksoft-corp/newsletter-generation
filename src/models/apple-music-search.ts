export interface AppleMusicSearchResponse {
    results: SearchResults;
    meta: SearchMeta;
  }
  
  export interface SearchResults {
    albums?: SearchCategory<Album>;
    songs?: SearchCategory<Song>;
    playlists?: SearchCategory<Playlist>;
    "music-videos"?: SearchCategory<MusicVideo>;
    artists?: SearchCategory<Artist>;
  }
  
  export interface SearchCategory<T> {
    href: string;
    next?: string;
    data: T[];
  }
  
  export interface Album {
    id: string;
    type: "albums";
    href: string;
    attributes: AlbumAttributes;
  }
  
  export interface AlbumAttributes {
    copyright: string;
    genreNames: string[];
    releaseDate: string;
    isMasteredForItunes: boolean;
    upc: string;
    artwork: Artwork;
    url: string;
    playParams: PlayParams;
    recordLabel: string;
    trackCount: number;
    isCompilation: boolean;
    isSingle: boolean;
    name: string;
    artistName: string;
    editorialNotes?: EditorialNotes;
    isComplete: boolean;
  }
  
  export interface Song {
    id: string;
    type: "songs";
    href: string;
    attributes: SongAttributes;
  }
  
  export interface SongAttributes {
    albumName: string;
    genreNames: string[];
    trackNumber: number;
    releaseDate: string;
    durationInMillis: number;
    isrc: string;
    artwork: Artwork;
    composerName: string;
    playParams: PlayParams;
    url: string;
    discNumber: number;
    hasLyrics: boolean;
    isAppleDigitalMaster: boolean;
    name: string;
    previews: Preview[];
    artistName: string;
    contentRating?: "explicit";
  }
  
  export interface Playlist {
    id: string;
    type: "playlists";
    href: string;
    attributes: PlaylistAttributes;
  }
  
  export interface PlaylistAttributes {
    curatorName: string;
    lastModifiedDate: string;
    name: string;
    isChart: boolean;
    playlistType: string;
    description: EditorialNotes;
    artwork: Artwork;
    playParams: PlayParams;
    url: string;
  }
  
  export interface MusicVideo {
    id: string;
    type: "music-videos";
    href: string;
    attributes: MusicVideoAttributes;
  }
  
  export interface MusicVideoAttributes {
    genreNames: string[];
    durationInMillis: number;
    releaseDate: string;
    has4K: boolean;
    hasHDR: boolean;
    name: string;
    previews: Preview[];
    isrc: string;
    artistName: string;
    artwork: Artwork;
    url: string;
    playParams: PlayParams;
  }
  
  export interface Artist {
    id: string;
    type: "artists";
    href: string;
    attributes: ArtistAttributes;
    relationships?: ArtistRelationships;
  }
  
  export interface ArtistAttributes {
    name: string;
    genreNames: string[];
    artwork: Artwork;
    url: string;
  }
  
  export interface ArtistRelationships {
    albums: SearchCategory<{ id: string; type: "albums"; href: string }>;
  }
  
  export interface EditorialNotes {
    short?: string;
    standard?: string;
  }
  
  export interface Artwork {
    width: number;
    height: number;
    url: string;
    bgColor?: string;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
  }
  
  export interface Preview {
    url: string;
    hlsUrl?: string;
    artwork?: Artwork;
  }
  
  export interface PlayParams {
    id: string;
    kind: string;
    versionHash?: string;
  }
  
  export interface SearchMeta {
    results: {
      order: string[];
      rawOrder: string[];
    };
  }
