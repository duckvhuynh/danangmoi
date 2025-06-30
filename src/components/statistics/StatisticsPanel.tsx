import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Users, Globe, BarChart, Ship, TrendingUp } from "lucide-react";
import { DANANG_CITY_INFO} from "../../data/danang-info";

export function StatisticsPanel() {
  return (
    <div className="space-y-4">
      {/* Da Nang Official Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {DANANG_CITY_INFO.officialName}
          </CardTitle>
          <CardDescription className="text-xs">
            Sắp xếp từ {DANANG_CITY_INFO.mergedFrom.join(" và ")}
          </CardDescription>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.totalArea}</div>
              <div className="text-xs text-muted-foreground">Diện tích</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.populationDensity}/km²</div>
              <div className="text-xs text-muted-foreground">Mật độ dân số</div>
            </div>
          </div>
          
          <div className="text-xs bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="w-3 h-3" />
              <span className="font-medium text-gray-800">Cơ cấu hành chính:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-white/60 rounded-md p-2 text-center">
                <div className="text-sm font-semibold text-primary">{DANANG_CITY_INFO.wards}</div>
                <div className="text-[10px] text-gray-500">Phường</div>
              </div>
              <div className="bg-white/60 rounded-md p-2 text-center">
                <div className="text-sm font-semibold text-green-600">{DANANG_CITY_INFO.communes}</div>
                <div className="text-[10px] text-gray-500">Xã</div>
              </div>
              <div className="bg-white/60 rounded-md p-2 text-center">
                <div className="text-sm font-semibold text-amber-600">{DANANG_CITY_INFO.specialZones}</div>
                <div className="text-[10px] text-gray-500">Đặc khu</div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Economic Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Thông tin kinh tế & hạ tầng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{DANANG_CITY_INFO.grdpBillionVND.toLocaleString('vi-VN')}</div>
              <div className="text-xs text-green-900/70">GRDP (tỷ VND)</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                {DANANG_CITY_INFO.vehicleLicenseCodes.map(code => (
                  <Badge key={code} variant="outline" className="bg-white text-blue-600 font-bold">{code}</Badge>
                ))}
              </div>
              <div className="text-xs text-blue-900/70 mt-1">Biển số xe</div>
            </div>
          </div>
          
          {DANANG_CITY_INFO.hasSeaport && (
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-600" />
                <div>
                  <div className="text-xs font-medium text-cyan-900">Cảng biển</div>
                  <div className="text-[11px] text-cyan-900/70">Cảng nước sâu quốc tế</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-cyan-700">{DANANG_CITY_INFO.seaportCount} <span className="text-xs font-normal">cảng</span>, {DANANG_CITY_INFO.pierCount} <span className="text-xs font-normal">bến</span></div>
            </div>
          )}
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
    </div>
  );
}
