import './App.css'
import { MainInterface } from '@/components/MainInterface'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  if (!apiKey) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🗺️ Thành phố Đà Nẵng (mới) - Tra Cứu Phường Xã
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Cần cấu hình Google Maps API Key
            </h2>
            <p className="text-yellow-700">
              Vui lòng thêm <code className="bg-yellow-100 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> vào file .env
            </p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>94 Đơn vị hành chính</strong> (23 phường, 70 xã, 1 đặc khu Hoàng Sa)</p>
            <p><strong>Diện tích:</strong> 11.867,18 km² • <strong>Dân số:</strong> 3.065.628 người</p>
            <p>Ứng dụng hỗ trợ người dân tra cứu thông tin phường xã mới sau sáp nhập</p>
            <p>Hiệu lực từ ngày 1/7/2025</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <MainInterface apiKey={apiKey} />
      <Toaster position="top-right" closeButton richColors theme="light" />
    </div>
  );
}

export default App
