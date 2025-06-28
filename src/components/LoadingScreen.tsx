import { Loader2, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Đang tải bản đồ..." }: LoadingScreenProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-96 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Thành phố Đà Nẵng (mới)</h1>
          <p className="text-gray-600 text-sm">94 đơn vị hành chính cấp xã • 3.065.628 dân</p>
          <p className="text-gray-600 text-sm">Tra cứu phường xã sau sáp nhập</p>
          
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">{message}</span>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>📅 Hiệu lực từ ngày 1/7/2025</p>
            <p>🏛️ UBND TP. Đà Nẵng</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <Card className="w-96 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Có lỗi xảy ra</h1>
          <p className="text-gray-600 text-sm">{error}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          )}
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>📞 Liên hệ hỗ trợ: 1900.xxxx</p>
            <p>📧 Email: support@danang.gov.vn</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
