import { MapPin, Search, BarChart3, Navigation, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { StatisticsPanel } from "./statistics/StatisticsPanel";
import { DANANG_CITY_INFO } from "../data/danang-info";

interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
}

interface AppSidebarProps {
  selectedWard: PolygonData | null;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onGetUserLocation: () => void;
  isLocating: boolean;
}

export function AppSidebar({
  selectedWard,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onGetUserLocation,
  isLocating,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
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
        <Tabs defaultValue="search" className="h-full flex flex-col">
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-3 shrink-0">
              <TabsTrigger value="search" className="text-xs p-2 min-w-0 flex-1">
                <Search className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Tra cứu</span>
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs p-2 min-w-0 flex-1">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs p-2 min-w-0 flex-1">
                <BarChart3 className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Thống kê</span>
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
                          <Navigation className="w-4 h-4 mr-2" />
                        )}
                        {isLocating ? "Đang xác định..." : "Xác định vị trí"}
                      </Button>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>

            <TabsContent value="info" className="p-4 space-y-4 m-0">
              {selectedWard ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Thông tin phường xã được chọn
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Phường/Xã</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedWard.ward}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Quận/Huyện</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedWard.district}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Phường xã mới
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Hiệu lực 1/7/2025
                      </Badge>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">
                      <Navigation className="w-4 h-4 mr-2" />
                      Tìm đường đến trụ sở
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center">
                    <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nhấp vào bản đồ hoặc tìm kiếm để xem thông tin phường xã
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="p-4 space-y-4 m-0">
              <StatisticsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  );
}
