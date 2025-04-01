import { Episode, BreakingProdLeaderboard, BigTopic } from './content-input';

export interface NewsletterEpisodeOutput {
  $schema?: string;
  episode: Episode & {episodeCoverUrl: string; links: { apple: string; spotify: string;} };
  images: {
    web_play: string;
    apple_podcasts: string;
    apple_music: string;
    spotify: string;
    youtube_music: string;
  }
  intro: string;
  showNotes: string[];
  quickfireQuestions: string[];
  breakingProdLeaderboard: BreakingProdLeaderboard;
  bigTopic: BigTopic;
  news: OutputItem[];
  recommendations: RecommendationsOutput; // now an array of sections
  joke: JokeOutput;
}
// New recommendations structure as an array of section outputs
export type RecommendationsOutput = RecommendationSectionOutput[];

export type RecommendationSectionOutput =
  | RelatedTopicSectionOutput
  | MusicSectionOutput
  | TechSectionOutput
  | TvAndFilmSectionOutput
  | BooksSectionOutput
  | PodcastsSectionOutput
  | MiscellaneousSectionOutput;

export interface RelatedTopicSectionOutput {
  sectionName: "relatedTopic";
  displayName: string;
  items: OutputItem[];
}

export interface OutputItem {
  type: "web" | "tv_and_film" | "book" | "podcast" ;
  title: string;
  uploadedImageUrl: string;
  description: string;
  url: string;
  buttonText: string;
  buttonBackgroundColour: string;
  buttonTextColour: string;
}

export interface MusicSectionOutput {
  sectionName: "music";
  displayName: string;
  items: MusicItemOutput[];
}

export interface MusicItemOutput {
  artist: string;
  album?: string;
  description: string;
  uploadedImageUrl: string;
  links: MusicLinkOutput[];
}

export interface MusicLinkOutput {
  platform: string;
  url: string;
}

export interface TechSectionOutput {
  sectionName: "tech";
  displayName: string;
  items: OutputItem[];
}

export interface TvAndFilmSectionOutput {
  sectionName: "tv_and_film";
  displayName: string;
  items: OutputItem[];
}

export interface BooksSectionOutput {
  sectionName: "books";
  displayName: string;
  items: OutputItem[];
}

export interface PodcastsSectionOutput {
  sectionName: "podcasts";
  displayName: string;
  items: OutputItem[];
}

export interface MiscellaneousSectionOutput {
  sectionName: "miscellaneous";
  displayName: string;
  items: OutputItem[];
}

export interface JokeOutput {
  setup: string;
  punchline: string;
}
