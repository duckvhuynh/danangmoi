import { Search, Navigation, Loader2, Info, LocateIcon, Map } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "./ui/sidebar";
import type { PolygonData } from "../data/polygon-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StatisticsPanel } from "./statistics/StatisticsPanel";
import { getWardColor } from "../lib/utils";
import { DANANG_CITY_INFO } from "../data/danang-info";

interface AppSidebarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onGetUserLocation: () => void;
  isLocating: boolean;
  selectedWard?: PolygonData | null;
  onWardSelect?: (ward: PolygonData) => void;
  danangPolygons?: PolygonData[];
}

// Selected polygon colors (gold/yellow)
const SELECTED_COLORS = {
  stroke: "#FFD700",
  fill: "#FFD700",
};

export function AppSidebar({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onGetUserLocation,
  isLocating,
  selectedWard,
  onWardSelect,
  danangPolygons,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-4">
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img
              src="/danang-logo.webp"
              alt="Da Nang Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight truncate">{DANANG_CITY_INFO.officialName}</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {DANANG_CITY_INFO.totalAdministrativeUnits} đơn vị hành chính cấp xã • {DANANG_CITY_INFO.populationFormatted} dân
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Tabs defaultValue="infor" className="h-full flex flex-col">
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-2 shrink-0">
              <TabsTrigger value="infor" className="text-xs p-2 min-w-0 flex-1">
                <Info className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs p-2 min-w-0 flex-1">
                <Search className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Tra cứu</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="search" className="p-4 space-y-4 m-0">
              {/* Search Section */}
              <SidebarGroup>
                <SidebarGroupLabel>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm địa chỉ cũ
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Label htmlFor="address-search" className="text-sm">
                          Nhập địa chỉ cũ
                        </Label>
                        <Input
                          id="address-search"
                          placeholder="VD: 02 Quang Trung, Thạch Thang"
                          value={searchQuery}
                          onChange={(e) => onSearchQueryChange(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button onClick={onSearch} className="w-full" size="sm">
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm
                      </Button>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Location Section */}
              <SidebarGroup>
                <SidebarGroupLabel>
                  <Navigation className="w-4 h-4 mr-2" />
                  Vị trí hiện tại
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Xác định vị trí để biết phường xã hiện tại
                      </p>
                      <Button
                        onClick={onGetUserLocation}
                        className="w-full"
                        size="sm"
                        disabled={isLocating}
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <LocateIcon className="w-4 h-4 mr-2" />
                        )}
                        {isLocating ? "Đang xác định..." : "Xác định vị trí"}
                      </Button>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>

            <TabsContent value="infor" className="p-4 space-y-4 m-0">
              <StatisticsPanel />
              
              {/* Administrative Areas Section */}
              {danangPolygons && danangPolygons.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="text-base font-medium flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      Đơn vị hành chính
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[300px] overflow-y-auto p-1">
                    <div className="space-y-1 pb-2">
                      {/* Group by district */}
                      {Object.entries(
                        danangPolygons.reduce<Record<string, PolygonData[]>>((acc, polygon) => {
                          if (!acc[polygon.district]) {
                            acc[polygon.district] = [];
                          }
                          acc[polygon.district].push(polygon);
                          return acc;
                        }, {})
                      ).map(([district, polygons]) => (
                        <div key={district} className="mb-2">
                          <div className="flex items-center px-2 py-1 bg-gray-50 rounded-md">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getWardColor(district).fill }}
                            ></div>
                            <span className="text-sm font-medium">{district}</span>
                          </div>
                          <div className="mt-1 pl-2 space-y-1">
                            {polygons.map((polygon) => (
                              <div
                                key={polygon.ward}
                                className={`px-2 py-1 rounded-sm text-sm flex items-center cursor-pointer ${
                                  selectedWard?.ward === polygon.ward
                                    ? "bg-yellow-100 font-medium"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => onWardSelect && onWardSelect(polygon)}
                              >
                                <div 
                                  className="w-2 h-2 rounded-full mr-2" 
                                  style={{ 
                                    backgroundColor: selectedWard?.ward === polygon.ward
                                      ? SELECTED_COLORS.fill
                                      : getWardColor(polygon.ward).fill,
                                    opacity: 0.7
                                  }}
                                ></div>
                                {polygon.ward}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col items-center p-1 border-t">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-1 my-1">
            <div className="w-16 h-8 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="1022 Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="max-w-[200px]">
              <p className="text-xs text-muted-foreground leading-tight">
                Trung tâm Thông tin và giám sát, điều hành thông minh Đà Nẵng
              </p>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-xs text-center text-muted-foreground">Hỗ trợ: <span className="font-medium">*1022 hoặc 0236.1022 (nhánh 3)</span></p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}