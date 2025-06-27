import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  return (
    <AdvancedMarker position={position}>
      <div className="relative flex items-center justify-center">
        {/* Pulsing outer ring */}
        <div className="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute w-6 h-6 bg-blue-500 rounded-full opacity-50 animate-pulse"></div>
        
        {/* Inner dot */}
        <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </AdvancedMarker>
  );
}
