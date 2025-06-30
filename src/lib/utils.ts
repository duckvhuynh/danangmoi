import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hash a string into a number using a variation of DJB2 + bitwise mixing
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Further mix bits
  return Math.abs((hash >>> 0) ^ (hash >>> 16));
}

/**
 * Convert name to a consistent and varied HSL color
 * @param name Unique string
 * @param baseSaturation 0–1
 * @param baseLightness 0–1
 */
export function generateColorFromName(name: string, baseSaturation = 0.65, baseLightness = 0.5): { stroke: string; fill: string } {
  if (!name) {
    return {
      stroke: `hsl(0, ${baseSaturation * 100}%, ${baseLightness * 100}%)`,
      fill: `hsl(0, ${baseSaturation * 100}%, ${baseLightness * 100}%)`,
    };
  }

  const hash = hashString(name);

  const hue = hash % 360;

  // add some variation to saturation/lightness (±10%) to avoid close colors
  const saturation = Math.max(0.4, Math.min(1, baseSaturation + (((hash >> 8) % 20) - 10) / 100));

  const lightness = Math.max(0.35, Math.min(0.75, baseLightness + (((hash >> 16) % 20) - 10) / 100));

  const color = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;

  return {
    stroke: color,
    fill: color,
  };
}

/**
 * Function to get color dynamically based on ward name
 * @param wardName The ward name
 * @returns An object with stroke and fill color properties
 */
export function getWardColor(wardName: string): { stroke: string; fill: string } {
  if (!wardName) return generateColorFromName("default", 0.3, 0.5);
  return generateColorFromName(wardName, 0.65, 0.55);
}

/**
 * Function to get color dynamically based on district name
 * @param districtName The district name
 * @returns An object with stroke and fill color properties
 */
export function getDistrictColor(districtName: string): { stroke: string; fill: string } {
  if (!districtName) return generateColorFromName("default", 0.3, 0.5);
  return generateColorFromName(districtName, 0.85, 0.45); // Higher saturation, slightly darker for districts
}
