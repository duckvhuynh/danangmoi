import { useEffect, useRef } from 'react';

interface WardNameOverlayProps {
  map: google.maps.Map | null;
  position: google.maps.LatLng | null;
  wardName: string;
  district: string;
  color: string;
  visible: boolean;
}

// Custom HTML/CSS based overlay to display ward name on hover
export default function WardNameOverlay({
  map,
  position,
  wardName,
  district,
  color,
  visible
}: WardNameOverlayProps) {
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    class WardOverlay extends google.maps.OverlayView {
      private container: HTMLDivElement;
      private position: google.maps.LatLng;
      private isVisible: boolean;
      private wardName: string;
      private district: string;
      private color: string;

      constructor(
        position: google.maps.LatLng, 
        isVisible: boolean, 
        wardName: string, 
        district: string, 
        color: string
      ) {
        super();
        this.position = position;
        this.isVisible = isVisible;
        this.wardName = wardName;
        this.district = district;
        this.color = color;
        
        // Create container and content
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.pointerEvents = 'none';
        this.container.className = 'ward-overlay';
        this.container.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
        this.container.style.opacity = '0';
        this.container.style.zIndex = '9999';
        this.container.style.transform = 'translate(-50%, -50%) translateY(-10px) scale(0.95)';
        this.updateContent();
        
        containerRef.current = this.container;
        this.setMap(map);
      }

      onAdd() {
        const pane = this.getPanes()!.overlayMouseTarget;
        pane.appendChild(this.container);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        
        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          this.container.style.left = point.x + 'px';
          this.container.style.top = point.y + 'px';
        }

        this.updateVisibility(this.isVisible);
      }
      
      onRemove() {
        if (this.container.parentElement) {
          this.container.parentElement.removeChild(this.container);
        }
      }
      
      updateContent() {
        // Create a beautiful card with shadcn styling
        this.container.innerHTML = `
          <div style="transform: translate(-50%, -50%);">
            <div class="bg-card text-card-foreground border-2 rounded-lg shadow-lg py-2 px-3 min-w-[180px]">
              <div class="flex flex-col items-center p-0">
                <div class="font-semibold text-sm text-center">
                  ${this.wardName}
                </div>
              </div>
            </div>
          </div>
        `;
      }
      
      getBorderColorClass() {
        switch (this.color) {
          case "#3B82F6": return "border-blue-500";
          case "#10B981": return "border-green-500";
          case "#F59E0B": return "border-yellow-500";
          case "#EF4444": return "border-red-500";
          case "#8B5CF6": return "border-purple-500";
          case "#EC4899": return "border-pink-500";
          case "#06B6D4": return "border-cyan-500";
          default: return "border-gray-500";
        }
      }
      
      updateVisibility(isVisible: boolean) {
        this.isVisible = isVisible;
        this.container.style.opacity = isVisible ? '1' : '0';
        this.container.style.transform = isVisible 
          ? 'translate(-50%, -50%) translateY(0) scale(1)' 
          : 'translate(-50%, -50%) translateY(-10px) scale(0.95)';
      }

      updatePosition(position: google.maps.LatLng) {
        this.position = position;
        this.draw();
      }
      
      updateProperties(wardName: string, district: string, color: string) {
        if (this.wardName !== wardName || this.district !== district || this.color !== color) {
          this.wardName = wardName;
          this.district = district;
          this.color = color;
          this.updateContent();
        }
      }
    }

    // Create the overlay
    const overlay = new WardOverlay(position, visible, wardName, district, color);
    overlayRef.current = overlay;

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
  }, [map, position, visible, wardName, district, color]);

  // Update overlay properties when they change
  useEffect(() => {
    const overlay = overlayRef.current as WardOverlay | null;
    if (overlay) {
      // Type guard to check if methods exist
      if (visible !== undefined && 'updateVisibility' in overlay) {
        (overlay as unknown as { updateVisibility: (isVisible: boolean) => void }).updateVisibility(visible);
      }
      
      if (position && 'updatePosition' in overlay) {
        (overlay as unknown as { updatePosition: (position: google.maps.LatLng) => void }).updatePosition(position);
      }
      
      if ('updateProperties' in overlay) {
        (overlay as unknown as { updateProperties: (wardName: string, district: string, color: string) => void })
          .updateProperties(wardName, district, color);
      }
    }
  }, [visible, position, wardName, district, color]);
  
  // TypeScript interface for our custom overlay
  interface WardOverlay extends google.maps.OverlayView {
    updateVisibility(isVisible: boolean): void;
    updatePosition(position: google.maps.LatLng): void;
    updateProperties(wardName: string, district: string, color: string): void;
  }

  return null;
}
