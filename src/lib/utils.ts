import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format duration (seconds to HH:MM:SS)
export const formatDuration = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

// Helper function to format view count
export const formatViewCount = (views: number) => {
  if (views === undefined) return "N/A";
  return new Intl.NumberFormat().format(views);
};