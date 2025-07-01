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
    // Callback when conversion is complete
    onConversionComplete: (newAddress) => {
      // Show toast notification on successful conversion
      toast.success("Chuyển đổi địa chỉ thành công", {
        description: "Đã tìm thấy địa chỉ mới tương ứng",
      });
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
      <SidebarHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-2 px-4 py-5">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight truncate text-white">{DANANG_CITY_INFO.officialName}</h1>
            <p className="text-xs text-blue-100 leading-relaxed">
              {DANANG_CITY_INFO.totalAdministrativeUnits} đơn vị hành chính • {DANANG_CITY_INFO.populationFormatted} dân
            </p>
            <p className="text-[10px] text-blue-200 leading-tight mt-0.5 italic opacity-80">
              dữ liệu cập nhật đến tháng 6/2025
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Tabs defaultValue="infor" className="h-full flex flex-col">
          <div className="px-4 py-2 border-b border-gray-100">
            <TabsList className="grid w-full grid-cols-2 shrink-0 bg-gray-100/70 p-1 rounded-xl">
              <TabsTrigger value="infor" className="text-xs min-w-0 flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg">
                <Info className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate font-medium">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs min-w-0 flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg relative">
                <Search className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate font-medium">Tra cứu địa chỉ</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">!</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="search" className="p-4 space-y-4 m-0">
              {/* Address Conversion Section */}
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                    <Search className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium">Tra cứu địa chỉ</span>
                    <span className="text-muted-foreground"> • Chuyển đổi địa chỉ trước 01/07/2025</span>
                  </div>
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
                          Địa chỉ chi tiết (nếu có)
                        </Label>
                        <Input
                          id="detailed-address"
                          placeholder={selectedDistrict === '498' ? '' : 'VD: 22 Phan Văn Định hoặc Tầng 4 căn hộ 719'}
                          value={detailedAddress}
                          onChange={(e) => setDetailedAddress(e.target.value)}
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

                      {/* Convert Button - Enhanced with gradient background and visual prominence */}
                      <Button
                        onClick={handleAddressConversion}
                        className={`w-full mt-2 shadow-md transition-all duration-200 ${isConverting ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} hover:shadow-lg`}
                        disabled={isConverting || (districtHasWards && !selectedOldWard)}
                      >
                        <div className="flex items-center justify-center w-full">
                          {isConverting ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          ) : (
                            <ArrowLeftRight className="w-5 h-5 mr-2" />
                          )}
                          <span className="font-medium text-sm">
                            {isConverting ? "Đang chuyển đổi..." : "Chuyển đổi địa chỉ"}
                          </span>
                        </div>
                      </Button>

                      {/* Conversion Result - Enhanced with better visual design */}
                      {convertedAddress && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-md shadow-sm">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                              <ArrowLeftRight className="w-4 h-4 text-green-700" />
                            </div>
                            <div>
                              <p className="text-xs text-green-600 font-medium">Kết quả chuyển đổi</p>
                              <p className="text-sm font-semibold text-green-800">Địa chỉ mới từ 01/07/2025</p>
                            </div>
                          </div>
                          <div className="p-3 bg-white border border-green-200 rounded-md mb-3">
                            <p className="text-sm font-medium text-gray-800">{convertedAddress}</p>
                          </div>
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                              onClick={resetConversion}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Đặt lại
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                              onClick={() => {
                                // Copy to clipboard
                                navigator.clipboard.writeText(convertedAddress);
                                // Toast notification
                                toast.success("Đã sao chép địa chỉ", {
                                  description: convertedAddress,
                                });
                              }}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Sao chép
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Conversion Error - Enhanced with better visual design */}
                      {conversionError && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-md shadow-sm">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <X className="w-4 h-4 text-red-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-800 mb-1">Lỗi chuyển đổi</p>
                              <p className="text-sm text-red-700">{conversionError}</p>
                              <p className="text-xs text-gray-700 mt-2 bg-white p-2 rounded border border-red-100">
                                Vui lòng kiểm tra lại thông tin hoặc thử một địa chỉ khác. Nếu vấn đề vẫn tiếp diễn,
                                hãy liên hệ qua đường dây nóng <span className="font-semibold">0236 1022</span>.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Location Section */}
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <Navigation className="w-3.5 h-3.5 text-green-700" />
                  </div>
                  <div>
                    <span className="font-medium">Vị trí hiện tại</span>
                    <span className="text-muted-foreground"> • Sử dụng GPS để định vị</span>
                  </div>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-2">
                        <h4 className="text-sm font-medium text-green-800 flex items-center mb-1">
                          <Navigation className="w-4 h-4 mr-1" />
                          Tính năng định vị
                        </h4>
                        <p className="text-xs text-green-700">
                          Xác định vị trí chính xác của bạn để biết phường xã hiện tại và các thông tin liên quan
                        </p>
                      </div>
                      <div className="relative">
                        <Button
                          onClick={onGetUserLocation}
                          className={`
                            w-full transition-all duration-300 shadow-md py-4 mb-2
                            relative overflow-hidden
                            ${isLocating
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            } hover:shadow-lg
                          `}
                          disabled={isLocating}
                          title="Cần cấp quyền truy cập vị trí trên trình duyệt"
                        >
                          {isLocating && <div className="absolute inset-0 bg-white/10 animate-pulse" />}

                          <div className="flex items-center justify-center relative z-10">
                            {isLocating ? (
                              <Loader2 className="w-5 h-5 mr-2 animate-spin text-white" />
                            ) : (
                              <LocateIcon className="w-5 h-5 mr-2 text-white" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {isLocating ? "Đang xác định vị trí..." : "Xác định vị trí hiện tại"}
                              </span>
                            </div>
                          </div>
                        </Button>
                        {isLocating && (
                          <div className="absolute -bottom-6 left-0 right-0 text-xs text-center bg-yellow-100 text-yellow-800 py-1 px-2 rounded-md font-medium">
                            Vui lòng chấp nhận quyền truy cập vị trí
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SidebarGroupContent>
              </SidebarGroup>
            </TabsContent>

            <TabsContent value="infor" className="p-4 space-y-4 m-0">
              <StatisticsPanel />

              {/* Administrative Areas Section */}
              {danangPolygons && danangPolygons.length > 0 && (
                <Card className="border-blue-100 shadow-sm">
                  <CardHeader className="pb-2 pt-3">
                    <div className="text-base font-medium flex items-center gap-2 text-blue-800">
                      <Map className="w-4 h-4" />
                      Danh sách đơn vị hành chính cấp xã
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2 space-y-3">
                    {/* Ward search */}
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          placeholder="Tìm phường, xã, đặc khu"
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
                        </div>
                      )}
                    </div>

                    {/* Ward list */}
                    <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1">
                      {filteredPolygons.length === 0 ? (
                        <div className="text-xs text-muted-foreground px-2 py-2 italic text-center">
                          Không tìm thấy đơn vị hành chính cấp xã phù hợp.
                        </div>
                      ) : (
                        filteredPolygons
                          .slice()
                          .sort((a, b) => {
                            const aIsWard = a.ward.startsWith("Phường");
                            const bIsWard = b.ward.startsWith("Phường");
                            const aIsCommune = a.ward.startsWith("Xã");
                            const bIsCommune = b.ward.startsWith("Xã");

                            if (aIsWard && !bIsWard) return -1;
                            if (!aIsWard && bIsWard) return 1;
                            if (aIsCommune && !bIsCommune && !bIsWard) return -1;
                            if (!aIsCommune && bIsCommune && !aIsWard) return 1;

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
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-amber-100 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-amber-100">
                  <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                    <Megaphone className="w-4 h-4" />
                    Thông báo quan trọng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="relative overflow-hidden flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-200/30 rounded-full"></div>
                      <div className="absolute right-2 -bottom-6 w-12 h-12 bg-amber-200/20 rounded-full"></div>
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full flex items-center justify-center shadow-inner border border-amber-200">
                        <span className="text-xl">🗓️</span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs font-medium text-amber-800">Có hiệu lực từ ngày</p>
                        <p className="text-lg font-bold text-amber-900">{DANANG_CITY_INFO.effectiveDate}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-xs font-medium text-gray-800 mb-3 flex items-center">
                        <Info className="w-3.5 h-3.5 mr-1 text-gray-600" />
                        Thông tin đáng chú ý:
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-white p-2.5 rounded-md border border-gray-100 hover:border-blue-200 transition-colors">
                          <Badge variant="outline" className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-blue-600 bg-blue-50 border-blue-200">1</Badge>
                          <div>
                            <p className="text-xs text-blue-800 font-medium">Mọi thắc mắc xin liên hệ</p>
                            <p className="text-xs text-gray-600">Đường dây nóng hỗ trợ tổ chức, công dân thực hiện thủ tục hành chính <span className="font-bold text-blue-700">*1022</span> hoặc <span className="font-bold text-blue-700">0236 1022</span> (nhánh 3)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white p-2.5 rounded-md border border-gray-100 hover:border-green-200 transition-colors">
                          <Badge variant="outline" className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-green-600 bg-green-50 border-green-200">2</Badge>
                          <div>
                            <p className="text-xs text-green-800 font-medium">Địa chỉ và mã đơn vị thay đổi</p>
                            <p className="text-xs text-gray-600">Trụ sở các phường xã có sự điều chỉnh theo quy định mới</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white p-2.5 rounded-md border border-gray-100 hover:border-amber-200 transition-colors">
                          <Badge variant="outline" className="w-7 h-7 rounded-full p-0 flex items-center justify-center text-amber-600 bg-amber-50 border-amber-200">3</Badge>
                          <div>
                            <p className="text-xs text-amber-800 font-medium">Giấy tờ cá nhân vẫn có giá trị</p>
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