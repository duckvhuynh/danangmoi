import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Navigation, Layers, Building2, Loader2 } from "lucide-react";

interface MapControlsProps {
  showPolygons: boolean;
  onTogglePolygons: (show: boolean) => void;
  showOffices: boolean;
  onToggleOffices: (show: boolean) => void;
  onGetUserLocation: () => void;
  isLocating: boolean;
}

export function MapControls({
  showPolygons,
  onTogglePolygons,
  showOffices,
  onToggleOffices,
  onGetUserLocation,
  isLocating,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 space-y-2 z-10">
      {/* Location Button */}
      <Button
        onClick={onGetUserLocation}
        size="sm"
        className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg border w-full"
        disabled={isLocating}
      >
        {isLocating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4 mr-2" />
        )}
        {isLocating ? "Đang xác định..." : "Vị trí của tôi"}
      </Button>
      
      {/* Layer Controls */}
      <Card className="p-3 space-y-3 shadow-lg min-w-[180px]">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-polygons" className="text-sm flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Ranh giới P/X
          </Label>
          <Switch
            id="show-polygons"
            checked={showPolygons}
            onCheckedChange={onTogglePolygons}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-offices" className="text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Trụ sở
          </Label>
          <Switch
            id="show-offices"
            checked={showOffices}
            onCheckedChange={onToggleOffices}
          />
        </div>
      </Card>
    </div>
  );
}
