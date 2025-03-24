import { downloadImage } from "../images/download-image";
import { BookItemOutput } from "../models/content-output";

export interface GoogleBookAttributes {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      publisher?: string;
      publishedDate?: string;
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
        [key: string]: string | undefined;
      };
      previewLink?: string;
      // Additional volumeInfo fields can be added if needed
    };
}
  
const booksApiKey = process.env.GOOGLE_API_KEY;
if (!booksApiKey) {
    throw new Error("Missing Google Books API Key in environment variables (GOOGLE_API_KEY).");
}

export async function getBook(episodeNumber: number, title: string, authors: string[]): Promise<BookItemOutput> {
    const query = `${title} ${authors.join(" ")}`;
    let googleBook = await getGoogleBook(query);
    let thumbnail = getGoogleBookThumbnail(googleBook);
    if (!thumbnail) {
        console.error(`No thumbnail found for book: ${title}`);
    } else {
        downloadImage(thumbnail, `episodes/${episodeNumber}/images/books/${title}`);
    }
}


/**
 * Fetches a Google Book based on a search query.
 * Returns the first book found.
 */
export async function getGoogleBook(query: string): Promise<GoogleBookAttributes> {
    const endpoint = `https://www.googleapis.com/books/v1/volumes`
        + `?q=${encodeURIComponent(query)}`
        + `&key=${booksApiKey}`
        + `&maxResults=1`;
  
    const response = await fetch(endpoint);
    const data = (await response.json()) as any;
    if (!data.items || data.items.length === 0) {
      throw new Error(`No books found for query: ${query}`);
    }
  
    return data.items[0] as GoogleBookAttributes;
}
  
/**
 * Utility function to extract a book's thumbnail image URL.
 */
export function getGoogleBookThumbnail(book: GoogleBookAttributes): string {
    return book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail || "";
}

/**
 * Utility function to extract the book's preview link.
 */
export function getGoogleBookPreviewLink(book: GoogleBookAttributes): string {
    return book.volumeInfo.previewLink || "";
}
