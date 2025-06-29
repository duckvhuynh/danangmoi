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
import { danangPolygons, isPointInPolygon as isPointInPolygonUtil } from "../data/polygon-utils";
import type { PolygonData } from "../data/polygon-utils";
import { offices } from "../data/offices";

// Da Nang coordinates
const DA_NANG_CENTER = { lat: 16.047079, lng: 108.206230 };

interface MainInterfaceProps {
  apiKey: string;
}

export function MainInterface({ apiKey }: MainInterfaceProps) {
  // Keep selectedWard state for map interactions (polygon highlighting, click handling)
  // even though it's no longer passed to AppSidebar after removing the "Thông tin" tab
  const [selectedWard, setSelectedWard] = useState<PolygonData | null>(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showOffices, setShowOffices] = useState(true);
  
  // This effect ensures the selectedWard variable is used
  useEffect(() => {
    console.log("Selected ward updated:", selectedWard?.ward || "None");
  }, [selectedWard]);
  
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
        // Check both single polygon and multipolygon
        return isPointInPolygonUtil(clickedPoint, ward.polygon, ward.polygons);
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
            // Check both single polygon and multipolygon
            return isPointInPolygonUtil(location, ward.polygon, ward.polygons);
          });
          
          if (userWard) {
            setSelectedWard(userWard);
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
      <div className="flex h-screen w-screen">
        <AppSidebar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onGetUserLocation={handleGetUserLocation}
          isLocating={isLocating}
        />
        
        <SidebarInset className="flex-1 h-full m-0 rounded-none shadow-none">
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
