import { Search, Navigation, Loader2, Info, LocateIcon, Map, X, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./ui/sidebar";
import type { PolygonData } from "../data/polygon-utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { StatisticsPanel } from "./statistics/StatisticsPanel";
import { getWardColor } from "../lib/utils";
import { DANANG_CITY_INFO } from "../data/danang-info";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Badge } from "./ui/badge";

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
  // Add state for ward filter
  const [wardFilter, setWardFilter] = useState("");

  // Function to normalize Vietnamese text by removing diacritics (accents)
  const normalizeVietnameseText = useCallback((text: string): string => {
    if (!text) return "";
    return text
      .normalize('NFD') // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, '') // Remove all diacritics/accents
      .toLowerCase()
      .trim();
  }, []);

  // Filter wards based on search input
  const filteredPolygons = useMemo(() => {
    if (!danangPolygons) return [];
    if (!wardFilter.trim()) return danangPolygons;

    // Regular filter with accent sensitivity
    const normalizedFilter = wardFilter.toLowerCase().trim();

    // Normalized filter without accents
    const normalizedFilterNoAccents = normalizeVietnameseText(wardFilter);

    return danangPolygons.filter(polygon => {
      const wardName = polygon.ward.toLowerCase();
      const districtName = polygon.district.toLowerCase();
      const normalizedWard = normalizeVietnameseText(polygon.ward);
      const normalizedDistrict = normalizeVietnameseText(polygon.district);

      // Check with accents first (exact match)
      if (wardName.includes(normalizedFilter) || districtName.includes(normalizedFilter)) {
        return true;
      }

      // Then check without accents (more lenient match)
      return normalizedWard.includes(normalizedFilterNoAccents) ||
        normalizedDistrict.includes(normalizedFilterNoAccents);
    });
  }, [danangPolygons, wardFilter, normalizeVietnameseText]);

  // Clear filter when selected ward changes
  // This improves UX by showing all wards again after a selection
  useEffect(() => {
    if (selectedWard) {
      setWardFilter("");
    }
  }, [selectedWard]);
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight truncate">{DANANG_CITY_INFO.officialName}</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {DANANG_CITY_INFO.totalAdministrativeUnits} đơn vị hành chính • {DANANG_CITY_INFO.populationFormatted} dân
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
                  <CardHeader>
                    <div className="text-base font-medium flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      Danh sách đơn vị hành chính
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2 space-y-3">
                    {/* Ward search */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Tìm phường, xã..."
                          value={wardFilter}
                          onChange={(e) => setWardFilter(e.target.value)}
                          className="pl-8"
                        />
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        {wardFilter && (
                          <button
                            onClick={() => setWardFilter("")}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Search stats */}
                      {wardFilter.trim() && (
                        <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                          <span>
                            Tìm thấy: {filteredPolygons?.length || 0}/{danangPolygons?.length || 0}
                          </span>
                          <span className="italic">
                            {normalizeVietnameseText(wardFilter) !== wardFilter.toLowerCase().trim()
                              ? "Đang tìm không dấu"
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Ward list */}
                    <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1">
                      {filteredPolygons
                        ?.slice() // make a copy to avoid mutating original array
                        .sort((a, b) => {
                          // First sort by type: Phường first, Xã second, others last
                          const aIsWard = a.ward.startsWith("Phường");
                          const bIsWard = b.ward.startsWith("Phường");
                          const aIsCommune = a.ward.startsWith("Xã");
                          const bIsCommune = b.ward.startsWith("Xã");

                          if (aIsWard && !bIsWard) return -1; // a is Phường, b is not
                          if (!aIsWard && bIsWard) return 1; // b is Phường, a is not
                          if (aIsCommune && !bIsCommune && !bIsWard) return -1; // a is Xã, b is not (and b is not Phường)
                          if (!aIsCommune && bIsCommune && !aIsWard) return 1; // b is Xã, a is not (and a is not Phường)
                          
                          // If they're the same type, sort alphabetically (Vietnamese)
                          return a.ward.localeCompare(b.ward, "vi");
                        })
                        .map((polygon) => (
                          <div
                            key={polygon.ward}
                            className={`px-3 py-2 rounded-sm flex items-center cursor-pointer transition-colors ${selectedWard?.ward === polygon.ward
                                ? "bg-yellow-100 font-medium"
                                : "hover:bg-gray-50"
                              }`}
                            onClick={() => onWardSelect && onWardSelect(polygon)}
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                              style={{
                                backgroundColor:
                                  selectedWard?.ward === polygon.ward
                                    ? SELECTED_COLORS.fill
                                    : getWardColor(polygon.ward).fill,
                              }}
                            ></div>
                            <span className="text-sm">{polygon.ward}</span>
                          </div>
                        ))}

                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Thông báo quan trọng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">🗓️</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-800">Có hiệu lực từ ngày</p>
                        <p className="text-sm font-bold">{DANANG_CITY_INFO.effectiveDate}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-gray-800 mb-2">Thông tin đáng chú ý:</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-blue-600">1</Badge>
                          <div>
                            <p className="text-xs text-gray-700 font-medium">Mọi thắc mắc xin liên hệ</p>
                            <p className="text-xs text-gray-600">Đường dây nóng hỗ trợ tổ chức, công dân thực hiện thủ tục hành chính *1022 hoặc 0236 1022 (nhánh 3)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-blue-600">2</Badge>
                          <div>
                            <p className="text-xs text-gray-700 font-medium">Địa chỉ và mã đơn vị thay đổi</p>
                            <p className="text-xs text-gray-600">Trụ sở các phường xã có sự điều chỉnh</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-blue-600">3</Badge>
                          <div>
                            <p className="text-xs text-gray-700 font-medium">Giấy tờ cá nhân vẫn có giá trị</p>
                            <p className="text-xs text-gray-600">Không cần đổi giấy tờ ngay sau sáp nhập</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </SidebarContent>
    </Sidebar>
  );
}