import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Globe, BarChart } from "lucide-react";
import { DANANG_CITY_INFO, formatPopulation} from "../../data/danang-info";

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
              <div className="text-xs text-muted-foreground">Đơn vị hành chính</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{formatPopulation(DANANG_CITY_INFO.populationFormatted)}</div>
              <div className="text-xs text-muted-foreground">Dân số (người)</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.totalArea}</div>
              <div className="text-xs text-muted-foreground">Diện tích</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{DANANG_CITY_INFO.populationDensity} người/km²</div>
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
    </div>
  );
}
