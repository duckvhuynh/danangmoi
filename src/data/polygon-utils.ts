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
const adminBoundaries = adminBoundariesData as AdminBoundary[];

export interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
  polygons?: Array<Array<{ lat: number; lng: number }>>; // For multipolygons
  id?: number;
  code?: string;
}

// Helper function to extract district name from ward name
function extractDistrictFromWard(wardName: string): string {
  // Common district names in Đà Nẵng
  const districts = [
    "Hải Châu",
    "Cẩm Lệ",
    "Sơn Trà",
    "Ngũ Hành Sơn",
    "Liên Chiểu",
    "Thanh Khê",
    "Hoà Vang"
  ];
  
  // Try to extract the district name from the ward name
  for (const district of districts) {
    if (wardName.includes(district)) {
      return district;
    }
  }
  
  // If we can't determine the district, use a placeholder
  return "Đà Nẵng";
}

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
      
      // Extract district from the ward name or set a default
      const district = extractDistrictFromWard(boundary.name);
      
      return {
        id: boundary.id,
        code: boundary.code,
        district,
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
