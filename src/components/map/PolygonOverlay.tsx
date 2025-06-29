import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import WardNameOverlay from "./WardNameOverlay";

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
  const [hoveredWard, setHoveredWard] = useState<PolygonData | null>(null);
  const [overlayPosition, setOverlayPosition] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    if (!map || !visible) {
      // Clear existing polygons
      polygonRefs.current.forEach(polygon => {
        polygon.setMap(null);
      });
      polygonRefs.current = [];
      // Clear hover state
      setHoveredWard(null);
      return;
    }

    // Clear existing polygons
    polygonRefs.current.forEach(polygon => {
      polygon.setMap(null);
    });
    polygonRefs.current = [];

    // Group polygons by ward name for synchronized hover effects
    const wardPolygonMap = new Map<string, google.maps.Polygon[]>();

    // Create new polygons
    polygons.forEach((polygonData) => {
      // Get colors for this district
      // const colors = DISTRICT_COLORS[polygonData.district] || DISTRICT_COLORS.default;
      
      // Array to store all polygon parts for this ward
      const wardPolygons: google.maps.Polygon[] = [];
      
      // Add to ward-polygon mapping
      wardPolygonMap.set(polygonData.ward, wardPolygons);

      // Function to create and set up a polygon with event handlers
      const createPolygon = (path: Array<{ lat: number; lng: number }>) => {
        if (!path || path.length === 0) return null;

        const polygon = new google.maps.Polygon({
          paths: path,
          strokeColor: "#1872c5",
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: "#1872c5",
          fillOpacity: 0.12,
          clickable: true,
          zIndex: 1,
        });

        polygon.setMap(map);
        
        // Add polygon to the ward's polygon array for synchronized hover
        wardPolygons.push(polygon);
        
        // Add click listener
        polygon.addListener('click', () => {
          if (onPolygonClick) {
            onPolygonClick(polygonData);
          }
        });

        // Add hover effects - highlight all polygons of the same ward
        polygon.addListener('mouseover', (event: google.maps.PolyMouseEvent) => {
          // Highlight all polygons for this ward
          const allWardPolygons = wardPolygonMap.get(polygonData.ward) || [];
          allWardPolygons.forEach(poly => {
            poly.setOptions({
              fillOpacity: 0.8,
              strokeWeight: 1.5,
              strokeOpacity: 1,
              zIndex: 2,
            });
          });
          
          // Calculate center of polygon or use the mouse position
          if (event.latLng) {
            setOverlayPosition(event.latLng);
          } else {
            // Calculate the center of the polygon
            const bounds = new google.maps.LatLngBounds();
            path.forEach(point => {
              bounds.extend(new google.maps.LatLng(point.lat, point.lng));
            });
            setOverlayPosition(bounds.getCenter());
          }
          
          setHoveredWard(polygonData);
        });

        polygon.addListener('mouseout', () => {
          // Reset all polygons for this ward
          const allWardPolygons = wardPolygonMap.get(polygonData.ward) || [];
          allWardPolygons.forEach(poly => {
            poly.setOptions({
              fillOpacity: 0.12,
              strokeWeight: 1,
              strokeOpacity: 0.8,
              zIndex: 1,
            });
          });
          
          setHoveredWard(null);
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
      setHoveredWard(null);
      setOverlayPosition(null);
    };
  }, [map, polygons, visible, onPolygonClick]);

  return (
    <>
      {hoveredWard && overlayPosition && (
        <WardNameOverlay 
          map={map}
          position={overlayPosition}
          wardName={hoveredWard.ward}
          district={hoveredWard.district}
          color={DISTRICT_COLORS[hoveredWard.district]?.fill || DISTRICT_COLORS.default.fill}
          visible={true}
        />
      )}
    </>
  )
}
