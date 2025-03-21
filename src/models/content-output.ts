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
    recommendations: RecommendationsOutput;
    joke: JokeOutput;
}
  
export interface NewsItemOutput {
    title: string;
    description: string;
    imageLocation: string;
    imageFilePath: string;
    uploadedImageUrl: string;
    link: string;
}

export interface RecommendationsOutput {
    relatedTopic: RelatedTopicItemOutput[];
    music: MusicItemOutput[];
    tech: TechItemOutput[];
    tv: TvItemOutput[];
    books: BookItemOutput[] | null;
    podcasts: PodcastItemOutput[] | null;
    // Allow additional properties if needed
    [key: string]: any;
}
  
export interface RelatedTopicItemOutput {
    type: string;
    title: string;
    url: string;
    authors?: string[];
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
  
export interface TechItemOutput {
    title: string;
    description: string;
    url: string;
}
  
export interface TvItemOutput {
    title: string;
    description: string;
    url: string;
}
  
export type BookItemOutput = any;    // Define a proper model if needed
export type PodcastItemOutput = any; // Define a proper model if needed
  
export interface JokeOutput {
    setup: string;
    punchline: string;
}
