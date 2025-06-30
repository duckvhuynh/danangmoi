import { MapControl } from "@vis.gl/react-google-maps";

interface MapFooterProps {
    className?: string;
}

export function MapFooter({ className }: MapFooterProps) {
    return (
        <MapControl position={google.maps.ControlPosition.BOTTOM_CENTER}>
            <div className={`bg-transparent bg-opacity-90 rounded-t-lg pb-1 ${className}`}>
                <div className="flex items-center space-x-2">
                    <div className="w-16 h-8 flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="1022 Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="max-w-[200px]">
                        <p className="text-xs text-muted-foreground leading-tight" style={{
                            textShadow: '0 0 2px white, 0 0 2px white, 0 0 2px white',
                        }}>
                            Trung tâm Thông tin và giám sát, điều hành thông minh Đà Nẵng
                        </p>
                    </div>
                </div>
            </div>
        </MapControl>
    );
}

export function MapHeader() {
    return (
        <MapControl position={google.maps.ControlPosition.TOP_CENTER}>
            <div className="bg-white bg-opacity-90 rounded-lg shadow-md px-4 py-2 text-center mt-4">
                <h1 className="text-base">Thành phố Đà Nẵng (từ 01/07/2025)</h1>
            </div>
        </MapControl>
    );
}
