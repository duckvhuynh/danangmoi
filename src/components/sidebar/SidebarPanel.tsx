import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { MapPin, Search, BarChart3, Building2, Navigation } from "lucide-react";
import { StatisticsPanel } from "../statistics/StatisticsPanel";

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
    <div className="w-96 bg-background border-l flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Đà Nẵng Mới</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Tra cứu thông tin phường xã sau sáp nhập
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="search" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
            <TabsTrigger value="search" className="text-xs">
              <Search className="w-4 h-4 mr-1" />
              Tra cứu
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              <MapPin className="w-4 h-4 mr-1" />
              Thông tin
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              Thống kê
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="search" className="p-4 space-y-4 m-0">
              {/* Search Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Tìm kiếm địa chỉ cũ
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
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </CardContent>
              </Card>

              {/* Location Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Vị trí hiện tại
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={onGetUserLocation} variant="outline" className="w-full" size="sm">
                    <Navigation className="w-4 h-4 mr-2" />
                    Xác định vị trí của tôi
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Tự động xác định phường/xã bạn đang ở
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="p-4 m-0">
              {selectedWard ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedWard.ward}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {selectedWard.district}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Thông tin cơ bản</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Quận/Huyện: {selectedWard.district}</p>
                        <p>Phường/Xã: {selectedWard.ward}</p>
                        <p>Số điểm ranh giới: {selectedWard.polygon?.length || 0}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Trụ sở phường</h4>
                      <Button variant="outline" size="sm" className="w-full mb-2">
                        <Building2 className="w-4 h-4 mr-2" />
                        Xem thông tin trụ sở
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Tìm đường đến trụ sở
                      </Button>
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
                  <p className="text-sm mt-1">
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
