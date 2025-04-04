import { downloadImage } from "../images/download-image";
import { uploadImage } from "../images/upload-image-to-kit";
import { OutputItem } from "../models/content-output";
import { BookItem } from "../models/content-input";
import { v4 as uuidv4 } from "uuid";

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

export async function getBooks(episodeNumber: number, books: BookItem[]): Promise<OutputItem[]> {
    const updatedBooks: OutputItem[] = [];
    for (const idx in books) {
        try {
            const book = books[idx];
            const cleanedAuthors = (book.authors || []).join(", ");
            const googleBook = await getGoogleBook(book.title, cleanedAuthors);
            const thumbnail = getGoogleBookThumbnail(googleBook);
            let uploadedImageUrl = "";
            if (!thumbnail) {
                console.error(`No thumbnail found for book: ${book.title}`);
            } else {
                let imageId = uuidv4();
                const localPath = `episodes/${episodeNumber}/images/books/${imageId}`;
                console.log(`Thumbnail Url to download is ${thumbnail}`);
                await downloadImage(thumbnail, localPath);
                uploadedImageUrl = await uploadImage(localPath);
            }
            updatedBooks[idx] = {
                type: "book",
                title: `${book.title}${cleanedAuthors ? ", by " + cleanedAuthors : ""}`,
                description: truncate(googleBook.volumeInfo.description),
                uploadedImageUrl,
                url: getGoogleBookPreviewLink(googleBook),
                buttonText: "Google Books",
                buttonBackgroundColour: "#337ce9",
                buttonTextColour: "#FFFFFF",
            };
        } catch (error) {
            console.error(`Error fetching book data for ${books[idx].title}:`, error);
        }
    }
    return updatedBooks;
}

/**
 * Fetches a Google Book based on a search query.
 * Returns the first book found.
 */
export async function getGoogleBook(title: string, authors: string): Promise<GoogleBookAttributes> {
    const query = `${title} ${authors}`;
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

function truncate(text?: string, maxLength = 300) {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}
