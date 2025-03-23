export interface NewsletterEpisode {
    episode: Episode;
    intro: string;
    showNotes: string[];
    quickfireQuestions: string[];
    breakingProdLeaderboard: BreakingProdLeaderboard;
    bigTopic: BigTopic;
    news: NewsItem[];
    recommendations: Recommendations;
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
  
  export interface Recommendations {
    relatedTopic: RelatedTopicItem[];
    music: MusicItem[];
    tech: TechItem[];
    tv: TvItem[];
    books: any[] | null;      // You can refine this if you have a model for books later
    podcasts: any[] | null;   // Same for podcasts
    // Additional properties are allowed here per the schema
    [key: string]: any;
  }
  
  export interface RelatedTopicItem {
    type: string;
    title: string;
    url: string;
    authors?: string[];
  }
  
  export interface MusicItem {
    artist: string;
    album?: string;
  }
  
  export interface TechItem {
    title: string;
    description: string;
    url: string;
  }
  
  export interface TvItem {
    title: string;
    url: string;
  }
  
  export interface Joke {
    setup: string;
    punchline: string;
  }
