import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Layers, Building2, Loader2, LocateIcon } from "lucide-react";

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
          <LocateIcon className="w-4 h-4 mr-2" />
        )}
        {isLocating ? "Đang xác định..." : "Vị trí của tôi"}
      </Button>

      {/* Layer Controls */}
      <Card className="p-3 space-y-3 shadow-lg min-w-[180px]">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor="show-polygons" 
            className="text-sm flex items-center gap-2 mr-2"
          >
            <Layers className="w-4 h-4" />
            <span className="inline-block">Ranh giới hành chính P/X</span>
          </Label>
          <div className="flex items-center">
            <Switch
              id="show-polygons"
              checked={showPolygons}
              onCheckedChange={onTogglePolygons}
              className="my-auto"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label 
            htmlFor="show-offices" 
            className="text-sm flex items-center gap-2 my-auto"
          >
            <Building2 className="w-4 h-4" />
            <span className="inline-block">Vị trí trung tâm PV HCC</span>
          </Label>
          <div className="flex items-center">
            <Switch
              id="show-offices"
              checked={showOffices}
              onCheckedChange={onToggleOffices}
              className="my-auto"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}