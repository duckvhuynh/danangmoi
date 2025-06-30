import { Search, Navigation, Loader2, Info, LocateIcon, Map, X, ArrowLeftRight, Megaphone, Copy } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { useAddressConversion } from "../hooks/use-address-conversion";
import { toast } from "sonner";

interface AppSidebarProps {
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
  onGetUserLocation,
  isLocating,
  selectedWard,
  onWardSelect,
  danangPolygons,
}: AppSidebarProps) {
  // Add state for ward filter
  const [wardFilter, setWardFilter] = useState("");

  // Use the address conversion hook with optional callback for conversion completion
  const {
    selectedProvince,
    selectedDistrict,
    selectedOldWard,
    detailedAddress,
    convertedAddress,
    conversionError,
    isConverting,
    provinces,
    districts,
    wards,
    districtHasWards,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedOldWard,
    setDetailedAddress,
    handleAddressConversion,
    resetConversion
  } = useAddressConversion({
    // Optional callback when conversion is complete
    onConversionComplete: (newAddress) => {
      // Here we could add toast notification or other feedback
      console.log("Address conversion complete:", newAddress);
    }
  });

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
              {/* Address Conversion Section */}
              <SidebarGroup>
                <SidebarGroupLabel>
                  <Search className="w-4 h-4 mr-2" />
                  Tra cứu địa chỉ hoặc quận/huyện trước 01/07/2025
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      {/* Province Selection */}
                      <div>
                        <Label htmlFor="province-select" className="text-sm mb-1 block">
                          Tỉnh/Thành phố
                        </Label>
                        <Select
                          value={selectedProvince}
                          onValueChange={(value) => setSelectedProvince(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {provinces.map((province) => (
                                <SelectItem key={province.code} value={province.code}>
                                  {province.fullName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* District Selection - Always shown but disabled until province is selected */}
                      <div>
                        <Label htmlFor="district-select" className="text-sm mb-1 block">
                          Quận/Huyện
                        </Label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={(value) => setSelectedDistrict(value)}
                          disabled={!selectedProvince || districts.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {districts.map((district) => (
                                <SelectItem key={district.code} value={district.code}>
                                  {district.fullName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ward Selection - Only shown if district has wards */}
                      {(districtHasWards || !selectedDistrict) && (
                        <div>
                          <Label htmlFor="ward-select" className="text-sm mb-1 block">
                            Phường/Xã
                          </Label>
                          <Select
                            value={selectedOldWard}
                            onValueChange={(value) => setSelectedOldWard(value)}
                            disabled={!selectedDistrict || wards.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn phường/xã" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {wards.map((ward) => (
                                  <SelectItem key={ward.code} value={ward.code}>
                                    {ward.fullName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Detailed Address Input - Always shown, enabled for selected ward or for special districts like Hoàng Sa */}
                      <div>
                        <Label htmlFor="detailed-address" className="text-sm mb-1 block">
                          Địa chỉ chi tiết
                        </Label>
                        <Input
                          id="detailed-address"
                          placeholder={selectedDistrict === '498' ? '' : 'VD: 97 Phan Huỳnh Điểu hoặc Tầng 4 căn hộ 719'}
                          value={detailedAddress}
                          onChange={(e) => setDetailedAddress(e.target.value)}
                          disabled={!selectedOldWard && (districtHasWards || !selectedDistrict)}
                        />
                      </div>

                      {/* Address Preview - Display the full selected address */}
                      {selectedProvince && (
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-md mb-3">
                          <p className="text-xs text-gray-600 font-medium mb-1">Địa chỉ trước 01/07/2025:</p>
                          <p className="text-sm text-gray-800">
                            {detailedAddress ? (
                              <>
                                <span className="font-medium">{detailedAddress}</span>
                                {(selectedOldWard || selectedDistrict === '498') && <span>, </span>}
                              </>
                            ) : (selectedOldWard || (selectedDistrict === '498' && !districtHasWards)) ? (
                              <span className="text-gray-400 italic">(Chưa nhập địa chỉ chi tiết), </span>
                            ) : null}
                            {selectedOldWard && (
                              <>
                                <span>{wards.find(w => w.code === selectedOldWard)?.fullName}</span>
                                <span>, </span>
                              </>
                            )}
                            {selectedDistrict && (
                              <>
                                <span>{districts.find(d => d.code === selectedDistrict)?.fullName}</span>
                                <span>, </span>
                              </>
                            )}
                            {selectedProvince && (
                              <span>{provinces.find(p => p.code === selectedProvince)?.fullName}</span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Convert Button - Always shown but disabled until all required fields are filled */}
                      <Button
                        onClick={handleAddressConversion}
                        className="w-full mt-1"
                        disabled={isConverting || !detailedAddress.trim() || (districtHasWards && !selectedOldWard)}
                      >
                        {isConverting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ArrowLeftRight className="w-4 h-4 mr-2" />
                        )}
                        {isConverting ? "Đang chuyển đổi..." : "Chuyển đổi địa chỉ"}
                      </Button>

                      {/* Conversion Result */}
                      {convertedAddress && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-xs text-green-700 font-medium mb-1">Địa chỉ mới:</p>
                          <p className="text-sm font-medium">{convertedAddress}</p>
                          <div className="mt-2 flex justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 text-gray-600"
                              onClick={resetConversion}
                            >
                              <X className="w-3 h-3" />
                              Đặt lại
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 text-green-800"
                              onClick={() => {
                                // Copy to clipboard
                                navigator.clipboard.writeText(convertedAddress);
                                // Could add toast notification here
                                toast.success("Đã sao chép địa chỉ", {
                                  description: convertedAddress,
                                });
                              }}
                            >
                              <Copy className="h-3 w-3" />
                              Sao chép
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Conversion Error */}
                      {conversionError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-xs text-red-700">{conversionError}</p>
                        </div>
                      )}
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
                    <Megaphone className="w-4 h-4" />
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