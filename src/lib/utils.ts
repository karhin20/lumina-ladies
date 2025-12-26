import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to clean a single URL string
function cleanUrl(url: string | any): string | null {
  if (typeof url !== 'string') return null;
  let cleaned = url.trim();
  // Remove " at start/end
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Remove ' at start/end
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  // Remove square brackets if it's somehow a customized string [url]
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    // It might be a single item array string that wasn't parsed as JSON? 
    // recursive call?
    const inside = cleaned.slice(1, -1).trim();
    return cleanUrl(inside);
  }

  if (!cleaned) return null;
  return cleaned;
}

export function getValidImageUrl(imageSource: string | string[] | null | undefined): string | null {
  if (!imageSource) return null;

  // If it's already an array, take the first item
  if (Array.isArray(imageSource)) {
    if (imageSource.length === 0) return null;
    return cleanUrl(imageSource[0]);
  }

  // If it's a string
  if (typeof imageSource === 'string') {
    const trimmed = imageSource.trim();

    // Check if it looks like a JSON array
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return cleanUrl(parsed[0]);
        }
        // If it parses as array but empty
        if (Array.isArray(parsed) && parsed.length === 0) return null;

      } catch (e) {
        // Failed to parse, maybe single quotes?
        // Fallback: strip brackets and try to clean content
        const content = trimmed.slice(1, -1).trim();
        // If there are commas, it's a list, take first
        const firstPart = content.split(',')[0].trim();
        return cleanUrl(firstPart);
      }
    }

    // Normal string
    return cleanUrl(trimmed);
  }

  return null;
}
