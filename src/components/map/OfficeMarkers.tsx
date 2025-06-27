import { AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import type { Office } from "../../data/offices";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";

interface OfficeMarkersProps {
  offices: Office[];
  visible: boolean;
}

export function OfficeMarkers({ offices, visible }: OfficeMarkersProps) {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  if (!visible) return null;

  const getMarkerColor = (type: Office['type']) => {
    switch (type) {
      case 'city':
        return '#DC2626'; // red-600
      case 'district':
        return '#2563EB'; // blue-600
      case 'ward':
        return '#16A34A'; // green-600
      default:
        return '#6B7280'; // gray-500
    }
  };

  const getOfficeTypeLabel = (type: Office['type']) => {
    switch (type) {
      case 'city':
        return 'Thành phố';
      case 'district':
        return 'Quận/Huyện';
      case 'ward':
        return 'Phường/Xã';
      default:
        return 'Khác';
    }
  };

  return (
    <>
      {offices.map((office) => (
        <AdvancedMarker
          key={office.id}
          position={office.position}
          onClick={() => setSelectedOffice(office)}
        >
          <Pin
            background={getMarkerColor(office.type)}
            borderColor="#FFFFFF"
            glyphColor="#FFFFFF"
            scale={office.type === 'city' ? 1.4 : office.type === 'district' ? 1.2 : 1.0}
          />
        </AdvancedMarker>
      ))}

      {selectedOffice && (
        <InfoWindow
          position={selectedOffice.position}
          onCloseClick={() => setSelectedOffice(null)}
        >
          <Card className="w-80 border-0 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {selectedOffice.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {getOfficeTypeLabel(selectedOffice.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{selectedOffice.address}</span>
              </div>
              
              {selectedOffice.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{selectedOffice.phone}</span>
                </div>
              )}
              
              {selectedOffice.workingHours && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{selectedOffice.workingHours}</span>
                </div>
              )}
              
              {selectedOffice.services && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Dịch vụ:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {selectedOffice.services.slice(0, 3).map((service, index) => (
                      <li key={index}>• {service}</li>
                    ))}
                    {selectedOffice.services.length > 3 && (
                      <li>• Và {selectedOffice.services.length - 3} dịch vụ khác</li>
                    )}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" variant="outline">
                  <Navigation className="w-4 h-4 mr-1" />
                  Chỉ đường
                </Button>
                <Button size="sm" className="flex-1" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Gọi điện
                </Button>
              </div>
            </CardContent>
          </Card>
        </InfoWindow>
      )}
    </>
  );
}
