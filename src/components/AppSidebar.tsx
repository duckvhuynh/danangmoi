import { MapPin, Search, Navigation, Loader2, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StatisticsPanel } from "./statistics/StatisticsPanel";
import { DANANG_CITY_INFO } from "../data/danang-info";

interface AppSidebarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onGetUserLocation: () => void;
  isLocating: boolean;
}

export function AppSidebar({
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
            <TabsList className="grid w-full grid-cols-2 shrink-0">
              <TabsTrigger value="search" className="text-xs p-2 min-w-0 flex-1">
                <Search className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Tra cứu</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs p-2 min-w-0 flex-1">
                <Info className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Thông tin</span>
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

            <TabsContent value="stats" className="p-4 space-y-4 m-0">
              <StatisticsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  );
}
