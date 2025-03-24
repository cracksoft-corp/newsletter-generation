import { Episode, BreakingProdLeaderboard, BigTopic } from './content-input';

export interface NewsletterEpisodeOutput {
  $schema?: string;
  episode: Episode;
  intro: string;
  showNotes: string[];
  quickfireQuestions: string[];
  breakingProdLeaderboard: BreakingProdLeaderboard;
  bigTopic: BigTopic;
  news: NewsItemOutput[];
  recommendations: RecommendationsOutput; // now an array of sections
  joke: JokeOutput;
}

export interface NewsItemOutput {
  title: string;
  description: string;
  uploadedImageUrl: string;
  url: string;
  buttonBackgroundColour: string;
  buttonTextColour: string;
  newsProvider: string;
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
  | UnknownSectionOutput;

export interface RelatedTopicSectionOutput {
  sectionName: "relatedTopic";
  displayName: string;
  items: RelatedTopicItemOutput[];
}

export interface RelatedTopicItemOutput {
  type: string;
  title: string;
  url: string;
  authors?: string[];
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
  items: TechItemOutput[];
}

export interface TechItemOutput {
  title: string;
  description: string;
  url: string;
}

export interface TvAndFilmSectionOutput {
  sectionName: "tv_and_film";
  displayName: string;
  items: TvItemOutput[];
}

export interface TvItemOutput {
  title: string;
  description: string;
  url: string;
  uploadedImageUrl: string;
  mediaProvider: string;
  buttonBackgroundColour: string;
  buttonTextColour: string;
}

export interface BooksSectionOutput {
  sectionName: "books";
  displayName: string;
  items: BookItemOutput[];
}

export type BookItemOutput = {
  title: string;
  authors: string[];
  description: string;
  url: string;
  uploadedImageUrl: string;
  buttonBackgroundColour: string;
  buttonTextColour: string;
}

export interface PodcastsSectionOutput {
  sectionName: "podcasts";
  displayName: string;
  items: PodcastItemOutput[];
}

export type PodcastItemOutput = {
  title: string;
  description: string;
  url: string;
  uploadedImageUrl: string;
  buttonBackgroundColour: string;
  buttonTextColour: string;
}

// Fallback for unknown section names if needed.
export interface UnknownSectionOutput {
  sectionName: string; // any value not matching the known ones
  displayName: string;
  items: unknown[];
}

export interface JokeOutput {
  setup: string;
  punchline: string;
}
