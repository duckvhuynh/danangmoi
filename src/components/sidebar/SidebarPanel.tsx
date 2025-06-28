import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { MapPin, Search, BarChart3, Building2, Navigation } from "lucide-react";
import { StatisticsPanel } from "../statistics/StatisticsPanel";
import { DANANG_CITY_INFO } from "../../data/danang-info";

interface PolygonData {
  district: string;
  ward: string;
  polygon: Array<{ lat: number; lng: number }>;
}

interface SidebarPanelProps {
  selectedWard: PolygonData | null;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onGetUserLocation: () => void;
}

export function SidebarPanel({
  selectedWard,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onGetUserLocation,
}: SidebarPanelProps) {
  return (
    <div className="w-full max-w-[28rem] min-w-[20rem] bg-background border-l flex flex-col">{" "}
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">{DANANG_CITY_INFO.officialName}</h1>
            <p className="text-xs text-muted-foreground leading-tight">
              {DANANG_CITY_INFO.mergedFrom.join(" + ")}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Dân số</p>
              <p className="font-medium text-sm">{DANANG_CITY_INFO.populationFormatted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Diện tích</p>
              <p className="font-medium text-sm">{DANANG_CITY_INFO.totalArea}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-1 text-xs text-blue-800">
            <CalendarClock className="w-3 h-3" />
            <span>Có hiệu lực:</span>
          </div>
          <div className="font-medium text-xs">{DANANG_CITY_INFO.effectiveDate}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="search" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0 shrink-0">
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

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="search" className="p-4 space-y-4 m-0">
              {/* Search Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-tight">Tìm kiếm địa chỉ cũ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <Search className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Tìm kiếm</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Location Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4 flex-shrink-0" />
                    <span className="leading-tight">Vị trí hiện tại</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={onGetUserLocation} variant="outline" className="w-full" size="sm">
                    <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Xác định vị trí của tôi</span>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Tự động xác định phường/xã bạn đang ở
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="p-4 m-0">
              {selectedWard ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {selectedWard.ward}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedWard.district}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="break-words">Quận/Huyện: {selectedWard.district}</p>
                        <p className="break-words">Phường/Xã: {selectedWard.ward}</p>
                        <p>Số điểm ranh giới: {selectedWard.polygon?.length || 0}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Trụ sở phường</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Xem thông tin trụ sở</span>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Tìm đường đến trụ sở</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Dịch vụ công</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Đăng ký hộ khẩu, tạm trú</p>
                        <p>• Cấp các loại giấy tờ</p>
                        <p>• Thủ tục hành chính</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa chọn phường/xã nào</p>
                  <p className="text-sm mt-1 leading-relaxed">
                    Nhấp vào bản đồ để xem thông tin
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="p-4 m-0">
              <StatisticsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          <p>Có hiệu lực từ 01/07/2025</p>
          <p>UBND TP. Đà Nẵng</p>
        </div>
      </div>
    </div>
  );
}
