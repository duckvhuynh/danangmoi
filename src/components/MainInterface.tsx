import { useState, useCallback, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MapControls } from "./map/MapControls";
import { PolygonOverlay } from "./map/PolygonOverlay";
import { UserLocationMarker } from "./map/UserLocationMarker";
import { OfficeMarkers } from "./map/OfficeMarkers";
import { LoadingScreen } from "./LoadingScreen";
import danangPolygons from "../data/danang_polygons.json";
import { offices } from "../data/offices";

// Da Nang coordinates
const DA_NANG_CENTER = { lat: 16.047079, lng: 108.206230 };

interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
}

interface MainInterfaceProps {
  apiKey: string;
}

export function MainInterface({ apiKey }: MainInterfaceProps) {
  const [selectedWard, setSelectedWard] = useState<PolygonData | null>(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showOffices, setShowOffices] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Handle map load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handlePolygonClick = useCallback((polygonData: PolygonData) => {
    setSelectedWard(polygonData);
  }, []);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const clickedPoint = event.detail.latLng;
      
      // Find which polygon contains the clicked point
      const foundWard = danangPolygons.find((ward) => {
        if (!ward.polygon || ward.polygon.length === 0) return false;
        
        // Simple point-in-polygon algorithm
        return isPointInPolygon(clickedPoint, ward.polygon);
      });

      if (foundWard) {
        setSelectedWard(foundWard as PolygonData);
      }
    }
  }, []);

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setIsLocating(false);
          
          // Find which ward the user is in
          const userWard = danangPolygons.find((ward) => {
            if (!ward.polygon || ward.polygon.length === 0) return false;
            return isPointInPolygon(location, ward.polygon);
          });
          
          if (userWard) {
            setSelectedWard(userWard as PolygonData);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  const handleSearch = () => {
    // TODO: Implement address search functionality
    console.log("Searching for:", searchQuery);
  };

  if (isMapLoading) {
    return <LoadingScreen message="Đang tải dữ liệu bản đồ..." />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar
          selectedWard={selectedWard}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onGetUserLocation={handleGetUserLocation}
          isLocating={isLocating}
        />
        
        <SidebarInset className="flex-1">
          <div className="flex h-full w-full relative">
            {/* Header with sidebar trigger */}
            <div className="absolute top-4 left-4 z-10">
              <SidebarTrigger className="bg-white shadow-lg hover:bg-gray-50" />
            </div>

            {/* Main Map */}
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={DA_NANG_CENTER}
                defaultZoom={12}
                mapId="danang-map"
                onClick={handleMapClick}
                className="w-full h-full"
                zoomControl={true}
                mapTypeControl={false}
                scaleControl={true}
                streetViewControl={false}
                rotateControl={false}
                fullscreenControl={true}
              >
                {/* Polygon overlays */}
                <PolygonOverlay
                  polygons={danangPolygons as PolygonData[]}
                  visible={showPolygons}
                  onPolygonClick={handlePolygonClick}
                />
                
                {/* Office markers */}
                <OfficeMarkers
                  offices={offices}
                  visible={showOffices}
                />
                
                {/* User location marker */}
                {userLocation && (
                  <UserLocationMarker position={userLocation} />
                )}
              </Map>

              {/* Map Controls */}
              <MapControls
                showPolygons={showPolygons}
                onTogglePolygons={setShowPolygons}
                showOffices={showOffices}
                onToggleOffices={setShowOffices}
                onGetUserLocation={handleGetUserLocation}
                isLocating={isLocating}
              />
            </APIProvider>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Helper function to check if a point is inside a polygon
function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (
      polygon[i].lat > point.lat !== polygon[j].lat > point.lat &&
      point.lng <
        ((polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat)) /
          (polygon[j].lat - polygon[i].lat) +
          polygon[i].lng
    ) {
      inside = !inside;
    }
  }
  return inside;
}
