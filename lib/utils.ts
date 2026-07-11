import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Read a document's cover image, tolerating the legacy misspelled `converImage`
 * field on old records. New writes always use `coverImage`.
 */
export function getCoverImage(doc: {
  coverImage?: string;
  converImage?: string;
}): string | undefined {
  return doc.coverImage ?? doc.converImage;
}
