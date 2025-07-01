import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Layers, Building2, Loader2, LocateIcon, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

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
  const [expanded, setExpanded] = useState(true);
  const isMobile = useIsMobile();
  
  // Collapse controls on mobile by default
  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);
  
  return (
    <div className="fixed md:absolute top-4 right-4 z-10 flex flex-col items-end">
      {/* Control panel */}
      <div 
        className={`
          bg-white/95 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 ease-in-out
          border border-gray-200/50 overflow-hidden
          ${expanded ? 'max-h-[300px] opacity-100' : 'max-h-12 opacity-95'}
        `}
      >
        <div className="p-3 flex flex-col gap-3 min-w-[220px] md:min-w-[250px]">
          {/* Header with toggle button */}
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => setExpanded(!expanded)}
          >
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Tùy chỉnh bản đồ
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
            >
              <ChevronUp 
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`}
              />
            </Button>
          </div>

          {/* Controls (visible when expanded) */}
          <div className={`space-y-4 transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Location Button */}
            <div className="relative">
              <Button
                onClick={onGetUserLocation}
                className={`
                  w-full h-9 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200/60 border
                  font-medium rounded-lg transition-all flex items-center justify-center
                  hover:shadow-md disabled:opacity-70 disabled:pointer-events-none
                  ${isLocating ? 'animate-pulse' : ''}
                `}
                disabled={isLocating}
                title="Cần cấp quyền truy cập vị trí trên trình duyệt"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LocateIcon className="w-4 h-4 mr-2" />
                )}
                {isLocating ? "Đang xác định..." : "Vị trí của tôi"}
              </Button>
              {isLocating && (
                <div className="absolute -bottom-6 left-0 right-0 text-xs text-center text-gray-500">
                  Vui lòng chấp nhận quyền truy cập
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="h-px bg-gray-200/70 w-full"></div>

            {/* Toggle Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between group">
                <Label 
                  htmlFor="show-polygons" 
                  className="text-sm flex items-center gap-2 text-gray-700 cursor-pointer group-hover:text-gray-900"
                >
                  <div className="p-1 bg-indigo-50 rounded-md group-hover:bg-indigo-100 transition-colors">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <span className="mr-2">Ranh giới hành chính P/X</span>
                </Label>
                <Switch
                  id="show-polygons"
                  checked={showPolygons}
                  onCheckedChange={onTogglePolygons}
                />
              </div>

              <div className="flex items-center justify-between group">
                <Label 
                  htmlFor="show-offices" 
                  className="text-sm flex items-center gap-2 text-gray-700 cursor-pointer group-hover:text-gray-900"
                >
                  <div className="p-1 bg-emerald-50 rounded-md group-hover:bg-emerald-100 transition-colors">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span>Vị trí trung tâm PV HCC</span>
                </Label>
                <Switch
                  id="show-offices"
                  checked={showOffices}
                  onCheckedChange={onToggleOffices}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}