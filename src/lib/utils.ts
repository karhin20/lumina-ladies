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
export function getStoragePathFromUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;

  // Supabase URL pattern: .../storage/v1/object/public/[bucket]/[path]
  // We want to capture everything after the bucket name
  const pattern = /\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/;
  const match = url.match(pattern);

  if (match && match[1]) {
    // Decode so we handle spaces and special chars correctly
    return decodeURIComponent(match[1]);
  }

  return null;
}

export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  // Extract ID from YouTube Shorts
  const shortsMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Extract ID from standard YouTube watch or youtu.be
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (ytMatch && ytMatch[1]) return ytMatch[1];

  // If we get here and it contains youtube.com but didn't match, try a fallback parsing
  const fallback = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&?\/]+)/);
  if (fallback && fallback[1] && fallback[1] !== 'shorts') return fallback[1];

  return null;
}

export function getVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // YouTube
  const ytId = getYoutubeVideoId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url; // Return as is if it might be a direct MP4
}

