import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCrore(crore: number, decimals = 0): string {
  if (crore >= 100_000) {
    return `₹${(crore / 100_000).toFixed(1)}L Cr`;
  }
  if (crore >= 1_000) {
    return `₹${(crore / 1_000).toFixed(decimals)}K Cr`;
  }
  return `₹${crore.toFixed(decimals)} Cr`;
}

export function formatLakhCrore(crore: number): string {
  return `₹${(crore / 100_000).toFixed(2)} lakh crore`;
}

export const PROJECTION_YEARS = Array.from({ length: 22 }, (_, i) => 2026 + i);
export const START_YEAR = 2026;
export const END_YEAR = 2047;
