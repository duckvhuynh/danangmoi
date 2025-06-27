
import './App.css'
import { MainInterface } from './components/MainInterface'

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🗺️ Đà Nẵng Mới - Tra Cứu Phường Xã
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Cần cấu hình Google Maps API Key
            </h2>
            <p className="text-yellow-700">
              Vui lòng thêm <code className="bg-yellow-100 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> vào file .env
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <p>Ứng dụng hỗ trợ người dân tra cứu thông tin phường xã mới sau sáp nhập</p>
            <p>Hiệu lực từ ngày 1/7/2025</p>
          </div>
        </div>
      </div>
    );
  }

  return <MainInterface apiKey={apiKey} />
}

export default App
