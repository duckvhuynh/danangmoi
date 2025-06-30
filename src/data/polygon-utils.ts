// Import with type assertion
import adminBoundariesData from './danang-adminstrative-boundaries.json';

// Define the type for the imported data
export interface AdminBoundary {
  id: number;
  level: number;
  code: string;
  name: string;
  paths: Array<Array<[number, number]>>;
  district?: string; // Added for compatibility
}

// Type assertion for the imported data
const adminBoundaries = adminBoundariesData as unknown as AdminBoundary[];
export interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
  polygons?: Array<Array<{ lat: number; lng: number }>>; // For multipolygons
  id?: number;
  code?: string;
}

// We're removing the district extraction functionality as requested
// A default district value is provided for backward compatibility
const DEFAULT_DISTRICT = "Đà Nẵng";

// Transform the new admin boundaries format to the format expected by our app
export function transformAdminBoundaries(): PolygonData[] {
  return adminBoundaries
    .filter(boundary => boundary && boundary.paths && boundary.paths.length > 0 && boundary.name)
    .map((boundary: AdminBoundary) => {
      // Handle multiple paths for multipolygons
      const polygons = boundary.paths
        .filter(path => Array.isArray(path) && path.length > 2) // Ensure it's an array and has enough points
        .map(path => {
          try {
            // Filter out invalid coordinates and ensure we have valid [lng, lat] pairs
            const validCoords = path.filter(coord => 
              Array.isArray(coord) && 
              coord.length === 2 && 
              typeof coord[0] === 'number' && 
              typeof coord[1] === 'number'
            );
            
            if (validCoords.length < 3) return []; // Not enough points for a valid polygon
            
            // Convert [lng, lat] format to {lat, lng} format
            return validCoords.map(coord => ({
              lat: coord[1], // Second element is latitude
              lng: coord[0]  // First element is longitude
            }));
          } catch (error) {
            console.error("Error processing path:", error);
            return [];
          }
        })
        .filter(path => path.length >= 3); // A valid polygon needs at least 3 points
      
      // Use the first valid path for backward compatibility with the polygon property
      const polygon = polygons.length > 0 ? polygons[0] : [];
      
      return {
        id: boundary.id,
        code: boundary.code,
        district: DEFAULT_DISTRICT, // Use default district for all wards now
        ward: boundary.name,
        polygon,      // Keep single polygon for backward compatibility
        polygons      // Store all polygons for multipolygon support
      };
    })
    .filter(data => data.polygon.length > 0); // Ensure we only return valid polygons
}

// Get all admin boundaries transformed to polygon data
export const danangPolygons: PolygonData[] = transformAdminBoundaries();

// Helper function to check if a point is inside a single polygon path
function isPointInSinglePolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  if (!polygon || polygon.length === 0) return false;
  
  // Ray casting algorithm
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    
    const intersect = ((yi > point.lat) != (yj > point.lat)) &&
        (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

// Utility function to check if a point is inside any polygon (handles multipolygons)
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>,
  polygons?: Array<Array<{ lat: number; lng: number }>>
): boolean {
  // Check multipolygons if available
  if (polygons && polygons.length > 0) {
    // Check each path in the multipolygon
    for (const path of polygons) {
      if (isPointInSinglePolygon(point, path)) {
        return true;
      }
    }
    return false;
  }
  
  // Fall back to checking the single polygon
  return isPointInSinglePolygon(point, polygon);
}

// Calculate the centroid of a simple polygon using the weighted average method
export function calculatePolygonCentroid(polygon: Array<{ lat: number; lng: number }>): { lat: number; lng: number } {
  if (!polygon || polygon.length < 3) {
    // Return default center of Da Nang if invalid polygon
    return { lat: 16.0544, lng: 108.2022 };
  }

  let area = 0;
  let lat = 0;
  let lng = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const factor = (polygon[i].lng * polygon[j].lat - polygon[j].lng * polygon[i].lat);
    area += factor;
    lat += (polygon[i].lat + polygon[j].lat) * factor;
    lng += (polygon[i].lng + polygon[j].lng) * factor;
  }

  area /= 2;
  area = Math.abs(area); // Ensure positive area

  // If area is too small, use simple average to avoid division by very small numbers
  if (area < 0.0000001) {
    return calculateSimpleAverageCenter(polygon);
  }

  lat /= (6 * area);
  lng /= (6 * area);

  return { lat, lng };
}

// Calculate the centroid for a multipolygon (largest polygon in the set)
export function calculateMultiPolygonCentroid(polygonData: PolygonData): { lat: number; lng: number } {
  let centroid: { lat: number; lng: number };
  
  // For multipolygons, use the largest polygon's centroid
  if (polygonData.polygons && polygonData.polygons.length > 0) {
    // Find the largest polygon by area
    let largestArea = 0;
    let largestPolygon = polygonData.polygons[0];
    
    for (const poly of polygonData.polygons) {
      const area = calculatePolygonArea(poly);
      if (area > largestArea) {
        largestArea = area;
        largestPolygon = poly;
      }
    }
    
    centroid = calculatePolygonCentroid(largestPolygon);
  } else {
    // Regular polygon
    centroid = calculatePolygonCentroid(polygonData.polygon);
  }
  
  // Check if the calculated centroid is actually inside the polygon
  // If not, use visual center (simple average) as a fallback
  if (!isPointInPolygon(centroid, polygonData.polygon, polygonData.polygons)) {
    if (polygonData.polygons && polygonData.polygons.length > 0) {
      return calculateSimpleAverageCenter(polygonData.polygon);
    } else {
      return calculateSimpleAverageCenter(polygonData.polygon);
    }
  }
  
  return centroid;
}

// Calculate the simple average center of a polygon (sum of coordinates / count)
function calculateSimpleAverageCenter(polygon: Array<{ lat: number; lng: number }>): { lat: number; lng: number } {
  if (!polygon || polygon.length === 0) {
    return { lat: 16.0544, lng: 108.2022 }; // Default Da Nang center
  }

  let totalLat = 0;
  let totalLng = 0;
  let count = 0;
  
  polygon.forEach(point => {
    totalLat += point.lat;
    totalLng += point.lng;
    count++;
  });
  
  return {
    lat: totalLat / count,
    lng: totalLng / count
  };
}

// Calculate the approximate area of a polygon
function calculatePolygonArea(polygon: Array<{ lat: number; lng: number }>): number {
  if (!polygon || polygon.length < 3) {
    return 0;
  }

  let area = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += polygon[i].lng * polygon[j].lat;
    area -= polygon[j].lng * polygon[i].lat;
  }

  area = Math.abs(area) / 2;
  return area;
}
