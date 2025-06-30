import { MapControl } from "@vis.gl/react-google-maps";
import { useIsMobile } from "../../hooks/use-mobile";
import { useSafeAreaInset } from "../../hooks/use-safe-area";
import { Calendar, MapPin } from "lucide-react";

interface MapFooterProps {
    className?: string;
}

export function MapFooter({ className }: MapFooterProps) {
    const isMobile = useIsMobile();
    const bottomInset = useSafeAreaInset('bottom');
    const leftInset = useSafeAreaInset('left');

    return (
        <MapControl position={google.maps.ControlPosition.BOTTOM_LEFT}>
            <div 
                className={`bg-white/90 backdrop-blur-sm shadow-lg border border-white/20 rounded-lg p-2 ${className}`}
                style={{
                    // Add safe area padding for mobile devices
                    marginBottom: isMobile ? `${Math.max(16, bottomInset + 8)}px` : '8px',
                    marginLeft: isMobile ? `${Math.max(8, leftInset)}px` : '8px',
                    // Ensure better visibility on mobile
                    maxWidth: isMobile ? '200px' : '250px',
                }}
            >
                <div className="flex items-center space-x-2">
                    <a
                        href="https://1022.vn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                        <div className={`${isMobile ? 'w-12 h-6' : 'w-16 h-8'} flex items-center justify-center`}>
                            <img
                                src="/logo.png"
                                alt="1022 Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className={`${isMobile ? 'max-w-[120px]' : 'max-w-[160px]'}`}>
                            <p 
                                className={`${isMobile ? 'text-[0.6rem]' : 'text-[0.65rem]'} text-gray-700 leading-tight font-medium`}
                            >
                                Trung tâm Thông tin và giám sát, điều hành thông minh Đà Nẵng
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        </MapControl>
    );
}

export function MapHeader() {
    const isMobile = useIsMobile();

    // Don't render the header on mobile devices
    if (isMobile) {
        return null;
    }

    return (
        <MapControl position={google.maps.ControlPosition.TOP_CENTER}>
            <div className="mt-4 mx-auto">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 px-3 py-2 text-center relative overflow-hidden">
                    {/* Main content */}
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <h1 className="text-[0.75rem] font-semibold text-gray-800 tracking-tight">
                                Thành phố Đà Nẵng
                            </h1>
                        </div>

                        <div className="w-px h-5 bg-gray-300/60" />

                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[0.75rem] text-muted-foreground">từ 01/07/2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </MapControl>
    );
}