import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Building2, Users, Globe, BarChart } from "lucide-react";
import { danangPolygons } from "../../data/polygon-utils";
import { DANANG_CITY_INFO } from "../../data/danang-info";

export function StatisticsPanel() {
  const districts = [...new Set(danangPolygons.map(item => item.district))];
  const totalWards = danangPolygons.length;
  
  const wardsByDistrict = districts.map(district => ({
    district,
    count: danangPolygons.filter(item => item.district === district).length
  }));

  return (
    <div className="space-y-4">
      {/* Da Nang Official Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {DANANG_CITY_INFO.officialName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.totalAdministrativeUnits}</div>
              <div className="text-xs text-muted-foreground">Đơn vị hành chính cấp xã</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.populationFormatted}</div>
              <div className="text-xs text-muted-foreground">Dân số (người)</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.totalArea}</div>
            <div className="text-xs text-muted-foreground">Diện tích</div>
          </div>
          
          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-3 h-3" />
              <span className="font-medium">Cơ cấu hành chính:</span>
            </div>
            <ul className="space-y-1 ml-5">
              <li>• {DANANG_CITY_INFO.wards} phường</li>
              <li>• {DANANG_CITY_INFO.communes} xã</li>
              <li>• {DANANG_CITY_INFO.specialZones} đặc khu {DANANG_CITY_INFO.specialZoneName}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current System Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Thống kê hiện tại trong hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{districts.length}</div>
              <div className="text-xs text-muted-foreground">Quận/Huyện</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalWards}</div>
              <div className="text-xs text-muted-foreground">Phường/Xã có dữ liệu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Phân bố theo quận/huyện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {wardsByDistrict.map(({ district, count }) => (
              <div key={district} className="flex items-center justify-between">
                <span className="text-sm">{district}</span>
                <Badge variant="secondary" className="text-xs">
                  {count} phường/xã
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Thông báo quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>🗓️ Có hiệu lực: <strong>01/07/2025</strong></p>
            <p>📋 Các phường/xã đã được sáp nhập theo quyết định mới</p>
            <p>🏢 Trụ sở các phường/xã có thể thay đổi</p>
            <p>📞 Liên hệ: 1900.xxxx để được hỗ trợ</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
