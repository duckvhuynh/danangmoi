import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { Office } from "../../data/office-utils";
import { Button } from "../ui/button";
import { MapPin, Phone, Navigation } from "lucide-react";
import { isPointInPolygon } from "../../data/polygon-utils";
import type { PolygonData } from "../../data/polygon-utils";

interface OfficeMarkersProps {
  offices: Office[];
  visible: boolean;
  selectedWard?: PolygonData | null;
  userLocation?: { lat: number; lng: number } | null;
}

export function OfficeMarkers({ offices, visible, selectedWard, userLocation }: OfficeMarkersProps) {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  // Helper function to create Google Maps directions URL
  const getGoogleMapsDirectionsUrl = (lat: number, lng: number): string => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    
    // Add origin parameter if user location is available
    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }
    
    return url;
  };

  const isOfficeInSelectedWard = (office: Office): boolean => {
    if (!selectedWard) return false;

    return isPointInPolygon(
      office.position,
      selectedWard.polygon,
      selectedWard.polygons
    );
  };

  const getMarkerColor = (office: Office) => {
    // Highlighted state for offices within selected polygon
    // if (selectedWard && isOfficeInSelectedWard(office)) {
    //   // Use a more vibrant yellow if general visibility is off to make highlighted offices stand out
    //   return !visible ? '#EAB308' : '#FACC15'; // yellow-600 vs yellow-500
    // }

    // Default colors based on type
    switch (office.type) {
      case 'commune':
        return '#449432';
      case 'ward':
        return '#2563EB';
      case 'special':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  // Function to determine if an office should be visible
  const shouldShowOffice = (office: Office): boolean => {
    // Always show offices within selected polygon
    if (selectedWard && isOfficeInSelectedWard(office)) {
      return true;
    }
    // Otherwise, show only if visible flag is true
    return visible;
  };

  return (
    <>
      {offices.map((office) =>
        shouldShowOffice(office) ? (
          <AdvancedMarker
            key={office.id}
            position={office.position}
            onClick={() => setSelectedOffice(office)}
          >
            <Pin
              background={getMarkerColor(office)}
              borderColor="#FFFFFF"
              glyphColor="#FFFFFF"
              scale={
                selectedWard && isOfficeInSelectedWard(office)
                  ? 1.2 // Larger scale for highlighted offices
                  : 0.8
              }
            />
          </AdvancedMarker>
        ) : null
      )}

      {selectedOffice && shouldShowOffice(selectedOffice) && (
        <InfoWindow
          position={selectedOffice.position}
          onCloseClick={() => setSelectedOffice(null)}
        >
          <div className="w-70 max-w-full p-0 bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <div className="px-4 pb-2">
                <h2 className="font-semibold truncate">Trung tâm Phục vụ hành chính công</h2>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedOffice.name}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-4 py-3 space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-0.5">Địa chỉ</div>
                  <div className="text-sm">{selectedOffice.address}</div>
                </div>
              </div>

              {/* Phone */}
              {selectedOffice.phone && (
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">Điện thoại</div>
                    <div className="text-sm">{selectedOffice.phone}</div>
                  </div>
                </div>
              )}

              {/* Services */}
              {selectedOffice.services && selectedOffice.services.length > 0 && (
                <div className="pt-1">
                  <div className="text-xs text-gray-500 mb-1">Dịch vụ chính</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedOffice.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="inline-flex text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                        {service}
                      </span>
                    ))}
                    {selectedOffice.services.length > 3 && (
                      <span className="inline-flex text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full">
                        +{selectedOffice.services.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons with gradient background */}
            <div className="px-4 py-3 flex gap-3">
              <Button
                size="sm"
                className="flex-1 bg-white"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    getGoogleMapsDirectionsUrl(
                      selectedOffice.position.lat,
                      selectedOffice.position.lng
                    ),
                    '_blank'
                  );
                }}
              >
                <Navigation className="w-4 h-4 mr-1.5" />
                Chỉ đường
              </Button>

              {selectedOffice.phone && (
                <Button
                  size="sm"
                  className="flex-1 bg-white hover:bg-green-50 border-green-200 hover:border-green-300 text-green-700"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${selectedOffice.phone}`;
                  }}
                >
                  <Phone className="w-4 h-4 mr-1.5" />
                  Gọi điện
                </Button>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
