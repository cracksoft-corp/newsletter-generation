//
// Core Episode Interfaces
//
export interface NewsletterEpisode {
  $schema: string;
  episode: Episode;
  intro: string;
  showNotes: string[];
  quickfireQuestions: string[];
  breakingProdLeaderboard: BreakingProdLeaderboard;
  bigTopic: BigTopic;
  news: NewsItem[];
  // The new approach: recommendations is an array of sections
  recommendations: RecommendationSection[];
  joke: Joke;
}

export interface Episode {
  number: number;
  date: string;
  title: string;
  links: {
    apple_podcasts: string;
    spotify: string;
  }
}

export interface BreakingProdLeaderboard {
  summary: string;
}

export interface BigTopic {
  title: string;
  questions: string[];
}

export interface NewsItem {
  url: string;
}

export interface Joke {
  setup: string;
  punchline: string;
}

//
// Recommendation Sections (Discriminated Union)
//
export type RecommendationSection =
  | RelatedTopicSection
  | MusicSection
  | TechSection
  | TvAndFilmSection
  | BooksSection
  | PodcastsSection
  | MiscellaneousSection;

export interface MusicSection {
  sectionName: "music";
  displayName: string;
  items: MusicItem[];
}

export interface TvAndFilmSection {
  sectionName: "tv_and_film";
  displayName: string;
  items: TvAndFilmItem[];
}


export interface BooksSection {
  sectionName: "books";
  displayName: string;
  items: BookItem[];
}

export interface PodcastsSection {
  sectionName: "podcasts";
  displayName: string;
  items: PodcastItem[];
}

export interface RelatedTopicSection {
  sectionName: "relatedTopic";
  displayName: string;
  items: RelatedTopicItem[];
}

export interface MiscellaneousSection {
  sectionName: "miscellaneous";
  displayName: string;
  items: WebItem[];
}

export type RelatedTopicItem = WebItem | BookItem | PodcastItem | TvAndFilmItem; // no music item

export interface MusicItem {
  artist: string;
  album?: string;
}

export interface TechSection {
  sectionName: "tech";
  displayName: string;
  items: WebItem[];
}

export interface WebItem {
  type: "web";
  title: string;
  url: string;
}

export interface PodcastItem {
  type: "podcast";
  title: string;
  url: string; 
}

export interface TvAndFilmItem {
  type: "tv_and_film";
  title: string;
  url: string;
}

export interface BookItem {
  type: "book";
  title: string;
  authors: string[];
}
