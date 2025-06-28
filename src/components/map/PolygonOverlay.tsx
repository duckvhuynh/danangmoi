import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
  polygons?: Array<Array<{ lat: number; lng: number }>>;
}

interface PolygonOverlayProps {
  polygons: PolygonData[];
  visible: boolean;
  onPolygonClick?: (polygon: PolygonData) => void;
}

// Color scheme for different districts
const DISTRICT_COLORS: Record<string, { stroke: string; fill: string }> = {
  "Hải Châu": { stroke: "#3B82F6", fill: "#3B82F6" },
  "Cẩm Lệ": { stroke: "#10B981", fill: "#10B981" },
  "Sơn Trà": { stroke: "#F59E0B", fill: "#F59E0B" },
  "Ngũ Hành Sơn": { stroke: "#EF4444", fill: "#EF4444" },
  "Liên Chiểu": { stroke: "#8B5CF6", fill: "#8B5CF6" },
  "Thanh Khê": { stroke: "#EC4899", fill: "#EC4899" },
  "Hoà Vang": { stroke: "#06B6D4", fill: "#06B6D4" },
  default: { stroke: "#6B7280", fill: "#6B7280" },
};

export function PolygonOverlay({ polygons, visible, onPolygonClick }: PolygonOverlayProps) {
  const map = useMap();
  const polygonRefs = useRef<google.maps.Polygon[]>([]);

  useEffect(() => {
    if (!map || !visible) {
      // Clear existing polygons
      polygonRefs.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonRefs.current = [];
      return;
    }

    // Clear existing polygons
    polygonRefs.current.forEach(polygon => {
      polygon.setMap(null);
    });
    polygonRefs.current = [];

    // Create new polygons
    polygons.forEach((polygonData) => {
      // Get colors for this district
      const colors = DISTRICT_COLORS[polygonData.district] || DISTRICT_COLORS.default;

      // Function to create and set up a polygon with event handlers
      const createPolygon = (path: Array<{ lat: number; lng: number }>) => {
        if (!path || path.length === 0) return null;

        const polygon = new google.maps.Polygon({
          paths: path,
          strokeColor: colors.stroke,
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: colors.fill,
          fillOpacity: 0.12,
          clickable: true,
          zIndex: 1,
        });

        polygon.setMap(map);
        
        // Add click listener
        polygon.addListener('click', () => {
          if (onPolygonClick) {
            onPolygonClick(polygonData);
          }
        });

        // Add hover effects
        polygon.addListener('mouseover', () => {
          polygon.setOptions({
            fillOpacity: 0.25,
            strokeWeight: 2.5,
            strokeOpacity: 1,
            zIndex: 2,
          });
        });

        polygon.addListener('mouseout', () => {
          polygon.setOptions({
            fillOpacity: 0.12,
            strokeWeight: 1.5,
            strokeOpacity: 0.8,
            zIndex: 1,
          });
        });

        return polygon;
      };

      // Handle multipolygons (multiple paths)
      if (polygonData.polygons && polygonData.polygons.length > 0) {
        // Create a polygon for each path in the multipolygon
        polygonData.polygons.forEach(path => {
          const polygon = createPolygon(path);
          if (polygon) polygonRefs.current.push(polygon);
        });
      } 
      // Fallback to single polygon for backward compatibility
      else if (polygonData.polygon && polygonData.polygon.length > 0) {
        const polygon = createPolygon(polygonData.polygon);
        if (polygon) polygonRefs.current.push(polygon);
      }
    });

    return () => {
      // Cleanup function
      polygonRefs.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonRefs.current = [];
    };
  }, [map, polygons, visible, onPolygonClick]);

  return null; // This component doesn't render anything directly
}
