import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";

interface ZoomAwareMapProps {
    id: string;
    defaultCenter: google.maps.LatLngLiteral;
    defaultZoom: number;
    mapId: string;
    onClick?: (event: MapMouseEvent) => void;
    className?: string;
    disableDefaultUI?: boolean;
    children?: ReactNode;
    onZoomChange?: (zoom: number) => void;
    initialBounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

export function ZoomAwareMap({
    id,
    defaultCenter,
    defaultZoom,
    mapId,
    onClick,
    className,
    disableDefaultUI,
    children,
    onZoomChange,
    initialBounds
}: ZoomAwareMapProps) {
    return (
        <Map
            id={id}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            mapId={mapId}
            onClick={onClick}
            className={className}
            gestureHandling={'greedy'}
            disableDefaultUI={disableDefaultUI}
            restriction={{
                latLngBounds: {
                    north: 23.5,   // Top of Northern Vietnam
                    south: 8.2,    // Southern tip of Vietnam (Cà Mau)
                    west: 102.1,   // Westernmost point (Lai Châu, Điện Biên)
                    east: 115.0,   // Far out into the East Sea to cover Trường Sa/Hoàng Sa
                },
                strictBounds: false // optional, allows slight scroll beyond
            }}

        >
            <ZoomHandler onZoomChange={onZoomChange} initialBounds={initialBounds} />
            {children}
        </Map>
    );
}

interface ZoomHandlerProps {
    onZoomChange?: (zoom: number) => void;
    initialBounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
    };
}

function ZoomHandler({ onZoomChange, initialBounds }: ZoomHandlerProps) {
    const map = useMap();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!map) return;

        // Fit to initial bounds if provided
        if (initialBounds && !initializedRef.current) {
            map.fitBounds(initialBounds);
            initializedRef.current = true;
        }

        // Listen for zoom changes
        const listener = map.addListener("zoom_changed", () => {
            const zoom = map.getZoom();
            if (zoom !== undefined && onZoomChange) {
                onZoomChange(zoom);
            }
        });

        return () => {
            google.maps.event.removeListener(listener);
        };
    }, [map, onZoomChange, initialBounds]);

    return null;
}
