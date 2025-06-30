import { useState, useCallback, useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { ZoomAwareMap } from "./map/ZoomAwareMap";
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
import { SelectedWardInfo } from "./map/SelectedWardInfo";
import { MapHeader, MapFooter } from "./map/MapInfo";
import { LoadingScreen } from "./LoadingScreen";
import { danangPolygons, isPointInPolygon as isPointInPolygonUtil } from "../data/polygon-utils";
import type { PolygonData } from "../data/polygon-utils";
import { offices } from "../data/office-utils";
import { getWholeDanangPolygon, getWholeDanangBounds } from "../data/whole-danang-utils";

// Da Nang coordinates
const DA_NANG_CENTER = { lat: 16.047079, lng: 108.206230 };
// Zoom threshold for showing detailed polygons vs whole city polygon
const ZOOM_THRESHOLD = 10;

interface MainInterfaceProps {
  apiKey: string;
}

export function MainInterface({ apiKey }: MainInterfaceProps) {
  // Keep selectedWard state for map interactions (polygon highlighting, click handling)
  // even though it's no longer passed to AppSidebar after removing the "Thông tin" tab
  const [selectedWard, setSelectedWard] = useState<PolygonData | null>(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showOffices, setShowOffices] = useState(false);
  
  // New state for zoom level and city boundary
  const [zoomLevel, setZoomLevel] = useState<number>(9); // Start with a zoom level below threshold
  const [wholeDanangPolygon] = useState<PolygonData>(getWholeDanangPolygon());
  const [danangBounds] = useState(getWholeDanangBounds());

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
      // Only process polygon selection when zoom level is at or above threshold
      // This prevents selecting administrative divisions when viewing the whole city
      if (zoomLevel >= ZOOM_THRESHOLD) {
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
    }
  }, [zoomLevel]);

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);

    let attempt = 0;
    const maxAttempts = 2;

    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy; // in meters
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // if accuracy > 100 meters and we haven't retried yet, try again
          if (accuracy > 100 && attempt < maxAttempts - 1) {
            attempt++;
            setTimeout(tryGetLocation, 1000); // wait a bit before retrying
            return;
          }

          setUserLocation(location);
          setIsLocating(false);

          const userWard = danangPolygons.find((ward) =>
            isPointInPolygonUtil(location, ward.polygon, ward.polygons)
          );

          if (userWard) {
            setSelectedWard(userWard);
          }
        },
        () => {
          // console.error("Error getting location:", error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    tryGetLocation();
  };


  const handleSearch = () => {
    // TODO: Implement address search functionality
    console.log("Searching for:", searchQuery);
  };

  const clearSelectedWard = () => {
    setSelectedWard(null);
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
          selectedWard={selectedWard}
          onWardSelect={handlePolygonClick}
          danangPolygons={danangPolygons as PolygonData[]}
        />

        <SidebarInset className="flex-1 h-full m-0 rounded-none shadow-none">
          <div className="flex h-full w-full relative">
            {/* Header with sidebar trigger */}
            <div className="absolute top-4 left-4 z-10">
              <SidebarTrigger className="bg-white shadow-lg hover:bg-gray-50" />
            </div>

            {/* Main Map */}
            <APIProvider apiKey={apiKey}>
              <ZoomAwareMap
                id="danang-map"
                defaultCenter={DA_NANG_CENTER}
                defaultZoom={9}
                mapId="8edea94d65887b5c9697477e"
                onClick={handleMapClick}
                className="w-full h-full"
                disableDefaultUI={true}
                onZoomChange={setZoomLevel}
                initialBounds={danangBounds}
              >
                {/* Whole city polygon (shown when zoom < ZOOM_THRESHOLD) - non-interactive */}
                {zoomLevel < ZOOM_THRESHOLD && (
                  <PolygonOverlay
                    polygons={[wholeDanangPolygon]}
                    visible={showPolygons}
                    selectedPolygon={selectedWard}
                    onPolygonClick={handlePolygonClick}
                    interactive={false} // Make the whole city polygon non-interactive
                  />
                )}
                
                {/* Detailed ward polygons (shown when zoom >= ZOOM_THRESHOLD) */}
                {zoomLevel >= ZOOM_THRESHOLD && (
                  <PolygonOverlay
                    polygons={danangPolygons as PolygonData[]}
                    visible={showPolygons}
                    selectedPolygon={selectedWard}
                    onPolygonClick={handlePolygonClick}
                  />
                )}

                {/* Office markers (only visible at higher zoom levels) */}
                <OfficeMarkers
                  offices={offices}
                  visible={showOffices && zoomLevel >= ZOOM_THRESHOLD}
                  selectedWard={selectedWard}
                  userLocation={userLocation}
                />

                {/* User location marker */}
                {userLocation && (
                  <UserLocationMarker position={userLocation} />
                )}
                
                {/* Map Header */}
                <MapHeader />
                
                {/* Map Footer */}
                <MapFooter />
              </ZoomAwareMap>

              {/* Map Controls */}
              <MapControls
                showPolygons={showPolygons}
                onTogglePolygons={setShowPolygons}
                showOffices={showOffices}
                onToggleOffices={setShowOffices}
                onGetUserLocation={handleGetUserLocation}
                isLocating={isLocating}
              />

              {/* Selected Ward Info Card/Drawer */}
              <SelectedWardInfo
                selectedWard={selectedWard}
                onClose={clearSelectedWard}
                userLocation={userLocation}
              />
            </APIProvider>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
