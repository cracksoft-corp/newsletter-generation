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
  | MusicSection
  | RelatedTopicSection
  | TechSection
  | TvAndFilmSection
  | BooksSection
  | PodcastsSection
  | UnknownSection; // fallback for unrecognized sectionName

//
// 1) Music
//
export interface MusicSection {
  sectionName: "music";
  displayName: string;
  items: MusicItem[];
}

export interface MusicItem {
  artist: string;
  album?: string;
}

//
// 2) Related Topic
//
export interface RelatedTopicSection {
  sectionName: "relatedTopic";
  displayName: string;
  items: RelatedTopicItem[];
}

export interface RelatedTopicItem {
  type: string;
  title: string;
  url: string;
  authors?: string[];
}

//
// 3) Tech
//
export interface TechSection {
  sectionName: "tech";
  displayName: string;
  items: TechItem[];
}

export interface TechItem {
  title: string;
  description: string;
  url: string;
}

//
// 4) TV & Film
//
export interface TvAndFilmSection {
  sectionName: "tv_and_film";
  displayName: string;
  items: TvAndFilmItem[];
}

export interface TvAndFilmItem {
  title: string;
  url: string;
}

//
// 5) Books
//
export interface BooksSection {
  sectionName: "books";
  displayName: string;
  items: BookItem[];
}

export interface BookItem {
  title: string;
  authors?: string[];
  url: string;
}

//
// 6) Podcasts
//
export interface PodcastsSection {
  sectionName: "podcasts";
  displayName: string;
  items: PodcastItem[];
}

export interface PodcastItem {
  title: string;
  url: string;
}

//
// 7) Fallback for unknown sectionName
//
export interface UnknownSection {
  // Any string that doesn't match the known section names above
  sectionName: string;
  displayName: string;
  items: unknown[]; // or a more generic shape if you prefer
}
