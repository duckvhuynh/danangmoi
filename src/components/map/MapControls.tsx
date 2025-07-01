import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Layers, Building2, Loader2, LocateIcon, ChevronUp, InfoIcon } from "lucide-react";
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
      {/* Control panel - Enhanced with better visual design */}
      <div 
        className={`
          bg-white backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 ease-in-out
          border border-gray-200 overflow-hidden
          ${expanded ? 'max-h-[400px] opacity-100 shadow-md' : 'max-h-12 opacity-95 shadow-sm'}
        `}
      >
        <div className="p-3 flex flex-col gap-3 min-w-[220px] md:min-w-[250px]">
          {/* Header with toggle button - Enhanced styling */}
          <div 
            className="flex items-center justify-between cursor-pointer" 
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <div>
                <span className="text-sm font-medium">Tùy chỉnh bản đồ</span>
              </div>
            </div>
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
            {/* Location Button - Enhanced with consistent styling from AppSidebar */}
            <div className="relative">
              {/* Info banner */}
              <div className="bg-green-50 p-2 rounded-md border border-green-100 mb-2">
                <div className="flex items-center">
                  <InfoIcon className="w-3.5 h-3.5 text-green-700 mr-1.5 flex-shrink-0" />
                  <p className="text-xs text-green-700">
                    Xác định vị trí để xem thông tin phường, xã
                  </p>
                </div>
              </div>
              
              {/* Location button with gradient matching AppSidebar */}
              <Button
                onClick={onGetUserLocation}
                className={`
                  w-full transition-all duration-300 shadow-md py-3
                  ${isLocating 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  } hover:shadow-lg
                `}
                disabled={isLocating}
                title="Cần cấp quyền truy cập vị trí trên trình duyệt"
              >
                <div className="flex items-center justify-center">
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LocateIcon className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-medium text-sm">
                    {isLocating ? "Đang xác định..." : "Xác định vị trí"}
                  </span>
                </div>
              </Button>
              
              {/* Permission notification */}
              {isLocating && (
                <div className="absolute -bottom-6 left-0 right-0 text-xs text-center bg-yellow-100 text-yellow-800 py-1 px-2 rounded-md font-medium">
                  Vui lòng chấp nhận quyền truy cập vị trí
                </div>
              )}
            </div>
            
            {/* Divider */}
            <div className="h-px bg-gray-200/70 w-full"></div>

            {/* Toggle Controls - Enhanced with consistent styling */}
            <div className="space-y-3">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100 transition-all hover:bg-indigo-100/70">
                <div className="flex items-center justify-between group">
                  <Label 
                    htmlFor="show-polygons" 
                    className="flex-1 flex items-center gap-2 cursor-pointer mr-2"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full">
                      <Layers className="w-4 h-4 text-indigo-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-900">Ranh giới hành chính</p>
                      <p className="text-xs text-indigo-700">Hiển thị ranh giới các phường, xã</p>
                    </div>
                  </Label>
                  <Switch
                    id="show-polygons"
                    checked={showPolygons}
                    onCheckedChange={onTogglePolygons}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </div>

              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 transition-all hover:bg-emerald-100/70">
                <div className="flex items-center justify-between group">
                  <Label 
                    htmlFor="show-offices" 
                    className="flex-1 flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900">Vị trí trụ sở</p>
                      <p className="text-xs text-emerald-700">Trung tâm phục vụ hành chính công</p>
                    </div>
                  </Label>
                  <Switch
                    id="show-offices"
                    checked={showOffices}
                    onCheckedChange={onToggleOffices}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}