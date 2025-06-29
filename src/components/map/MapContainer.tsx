import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Navigation } from "lucide-react";
import { danangPolygons, isPointInPolygon as isPointInPolygonCheck } from "../../data/polygon-utils";
import type { PolygonData } from "../../data/polygon-utils";
import { offices } from "../../data/offices";
import { PolygonOverlay } from "./PolygonOverlay";
import { UserLocationMarker } from "./UserLocationMarker";
import { OfficeMarkers } from "./OfficeMarkers";

// Da Nang coordinates
const DA_NANG_CENTER = { lat: 16.047079, lng: 108.206230 };

interface MapContainerProps {
  apiKey: string;
}

export function MapContainer({ apiKey }: MapContainerProps) {
  const [selectedWard, setSelectedWard] = useState<PolygonData | null>(null);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showOffices,] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handlePolygonClick = useCallback((polygonData: PolygonData) => {
    setSelectedWard(polygonData);
  }, []);

  const handleMapClick = useCallback((event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const clickedPoint = event.detail.latLng;
      
      // Find which polygon contains the clicked point
      const foundWard = danangPolygons.find((ward) => {
        // Use our point-in-polygon check from the utility file, checking both single and multi-polygons
        return isPointInPolygonCheck(clickedPoint, ward.polygon, ward.polygons);
      });

      if (foundWard) {
        setSelectedWard(foundWard);
      }
    }
  }, []);

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          // Find which ward the user is in
          const userWard = danangPolygons.find((ward) => {
            // Check both single and multi-polygons
            return isPointInPolygonCheck(location, ward.polygon, ward.polygons);
          });
          
          if (userWard) {
            setSelectedWard(userWard);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSearch = () => {
    // TODO: Implement address search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="h-screen w-full relative">
      <APIProvider apiKey={apiKey}>
        <div className="h-full">
          {/* Map */}
          <div className="h-full relative">
            <Map
              defaultCenter={DA_NANG_CENTER}
              defaultZoom={12}
              mapId="danang-map"
              onClick={handleMapClick}
              className="w-full h-full"
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
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                onClick={handleGetUserLocation}
                size="sm"
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Vị trí của tôi
              </Button>
              
              <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-lg">
                <Label htmlFor="show-polygons" className="text-sm">
                  Hiển thị ranh giới
                </Label>
                <Switch
                  id="show-polygons"
                  checked={showPolygons}
                  onCheckedChange={setShowPolygons}
                />
              </div>
            </div>
          </div>
        </div>
      </APIProvider>
    </div>
  );
}

// Helper function to check if a point is inside a polygon
// Using the isPointInPolygon function from polygon-utils.ts
