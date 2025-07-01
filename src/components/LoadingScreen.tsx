import { AlertCircle } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Đang tải bản đồ..." }: LoadingScreenProps) {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center overflow-hidden relative">
      {/* Background animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-64 h-64 bg-blue-400 opacity-20 rounded-full absolute -top-20 -left-20 animate-pulse" />
        <div className="w-96 h-96 bg-indigo-400 opacity-10 rounded-full absolute -bottom-40 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="w-72 h-72 bg-purple-400 opacity-15 rounded-full absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-md w-full mx-4 p-8 backdrop-blur-lg bg-white/20 rounded-2xl shadow-2xl text-center space-y-8">
        <div className="w-36 h-16 mx-auto">
          <img
            src="/logo.png"
            alt="1022 Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Thành phố Đà Nẵng</h1>
          <div className="h-1 w-20 bg-white/50 mx-auto rounded-full"></div>
          <p className="text-white/90 text-sm font-medium">94 Đơn vị hành chính • 3.122.915 dân</p>
          <p className="text-white/80 text-sm font-medium">Tra cứu phường xã sau sắp xếp</p>
        </div>
        
        {/* Loading spinner */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-100 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin absolute top-0 left-0" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <span className="text-white font-medium">{message}</span>
        </div>
        
        <div className="text-xs text-white/70 space-y-1">
          <p>Hiệu lực từ ngày 01/07/2025</p>
          <p>UBND TP. Đà Nẵng</p>
        </div>
      </div>
    </div>
  );
}

interface ErrorScreenProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-red-700 to-pink-900 flex items-center justify-center overflow-hidden relative">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-80 h-80 bg-red-400 opacity-15 rounded-full absolute -top-20 -right-20 animate-pulse" />
        <div className="w-64 h-64 bg-pink-400 opacity-10 rounded-full absolute bottom-0 left-20 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-md w-full mx-4 p-8 backdrop-blur-lg bg-white/20 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 bg-red-600/80 backdrop-blur rounded-full flex items-center justify-center mx-auto shadow-lg">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Có lỗi xảy ra</h1>
          <div className="h-1 w-20 bg-white/50 mx-auto rounded-full"></div>
          <p className="text-white/90 text-base">{error}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-white/20 backdrop-blur hover:bg-white/30 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Thử lại</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        )}
        
        <div className="text-xs text-white/70 pt-4 border-t border-white/20 mt-2">
          <p>Liên hệ hỗ trợ: *1022 hoặc 0236.1022</p>
        </div>
      </div>
    </div>
  );
}