import { useEffect, useRef } from 'react';

interface WardNameOverlayProps {
  map: google.maps.Map | null;
  position: google.maps.LatLng | null;
  wardName: string;
  district: string;
  color: string;
  visible: boolean;
}

// Custom HTML/CSS based overlay to display ward name on hover using shadcn/ui components
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
      private root: ShadowRoot;

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
        
        // Create container with shadow DOM for better style isolation
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.pointerEvents = 'none';
        this.container.className = 'ward-overlay';
        this.container.style.zIndex = '9999';
        
        // Create shadow DOM
        this.root = this.container.attachShadow({ mode: 'open' });
        
        // Add main container within shadow DOM
        const innerContainer = document.createElement('div');
        innerContainer.style.position = 'relative';
        innerContainer.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
        innerContainer.style.opacity = '0';
        innerContainer.style.transform = 'translate(-50%, -50%) translateY(-8px) scale(0.98)';
        innerContainer.style.willChange = 'transform, opacity';
        
        // Add styles to shadow DOM
        const style = document.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
            overflow: hidden;
            font-family: 'Inter', system-ui, sans-serif;
            max-width: 280px;
            transform: translate(-50%, -50%);
            color: #1f2937;
          }
          
          .card-content {
            padding: 12px 14px;
          }
          
          .badge {
            display: inline-flex;
            align-items: center;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            height: 18px;
            padding: 0 6px;
            background: #f3f4f6;
            color: #4b5563;
            border: 1px solid #e5e7eb;
          }
          
          .badge-colored {
            background: ${this.getColorWithOpacity(this.color, 0.15)};
            color: ${this.getColorWithOpacity(this.color, 1)};
            border: 1px solid ${this.getColorWithOpacity(this.color, 0.25)};
          }
          
          .title {
            font-size: 15px;
            font-weight: 600;
            line-height: 1.3;
            margin: 6px 0 4px;
          }
          
          .subtitle {
            font-size: 12px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
          }
          
          .separator {
            margin: 0 4px;
            color: #d1d5db;
          }
          
          .merged-info {
            font-size: 11px;
            color: #6b7280;
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #f3f4f6;
          }
          
          .merged-info-label {
            font-size: 10px;
            color: #9ca3af;
            margin-bottom: 2px;
          }
          
          .merged-info-content {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.3;
          }
          
          .color-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: ${this.color};
            margin-right: 4px;
            display: inline-block;
          }
        `;
        
        this.root.appendChild(style);
        this.root.appendChild(innerContainer);
        this.updateContent(innerContainer);
        
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
      
      getColorWithOpacity(hexColor: string, opacity: number): string {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      
      updateContent(container: HTMLElement) {
        // Import administrative information to display for the ward
        import('../../data/administrative-information.json').then(adminInfo => {
          const adminData = adminInfo.default;
          
          // Special case for Hoàng Sa
          const isHoangSa = this.wardName === "Đặc khu Hoàng Sa" || this.wardName === "Hoàng Sa";
          
          // Try to find this ward in the administrative data
          let wardInfo;
          
          if (isHoangSa) {
            // Search directly for Đặc khu Hoàng Sa
            wardInfo = adminData.commune_ward_list?.find(item => 
              item.new_commune_ward === "Đặc khu Hoàng Sa"
            );
          } else {
            // Normal case: Strip prefix and find the ward
            const normalizedWardName = this.wardName
              .replace(/^(Phường|Xã|P.|X.) /i, '')  // Remove ward/commune prefix if present
              .trim();
              
            wardInfo = adminData.commune_ward_list?.find(item => 
              item.new_commune_ward.toLowerCase() === normalizedWardName.toLowerCase()
            );
          }
          
          // Determine the type badge text
          let type;
          if (wardInfo?.new_commune_ward === "Đặc khu Hoàng Sa") {
            type = 'Đặc khu';
          } else {
            type = wardInfo?.is_commune ? 'Xã' : 'Phường';
          }
          
          const population = wardInfo?.population?.toLocaleString('vi-VN') || '';
          const area = wardInfo?.area_km2 ? `${wardInfo.area_km2} km²` : '';
          const mergedFrom = wardInfo?.merged_communes_wards || '';
          
          // Create the HTML content
          container.innerHTML = `
            <div class="card">
              <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <div class="badge">${type}</div>
                  <div class="badge badge-colored">
                    <span class="color-dot"></span>
                    ${this.district}
                  </div>
                </div>
                
                <h3 class="title">${wardInfo?.new_commune_ward || this.wardName}</h3>
                
                ${population || area ? `
                <div class="subtitle">
                  ${population ? `<span>${population} dân</span>` : ''}
                  ${population && area ? '<span class="separator">•</span>' : ''}
                  ${area ? `<span>${area}</span>` : ''}
                </div>
                ` : ''}
                
                ${mergedFrom ? `
                <div class="merged-info">
                  <div class="merged-info-label">Gộp từ các đơn vị:</div>
                  <div class="merged-info-content">${mergedFrom}</div>
                </div>
                ` : ''}
              </div>
            </div>
          `;
        }).catch((err) => {
          console.error("Error loading administrative data:", err);
          
          // Determine if this is Hoàng Sa for the fallback
          const isHoangSa = this.wardName === "Đặc khu Hoàng Sa" || this.wardName === "Hoàng Sa";
          const badgeText = isHoangSa ? "Đặc khu" : this.wardName.startsWith("Xã") ? "Xã" : "Phường";
          
          // Fallback in case of error
          container.innerHTML = `
            <div class="card">
              <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: center">
                  <div class="badge">${badgeText}</div>
                  <div class="badge badge-colored">
                    <span class="color-dot"></span>
                    ${this.district}
                  </div>
                </div>
                <h3 class="title">${this.wardName}</h3>
              </div>
            </div>
          `;
        });
      }
      
      updateVisibility(isVisible: boolean) {
        this.isVisible = isVisible;
        
        // Access the inner container within shadow DOM
        const innerContainer = this.root.querySelector('div');
        if (innerContainer) {
          innerContainer.style.opacity = isVisible ? '1' : '0';
          innerContainer.style.transform = isVisible 
            ? 'translate(-50%, -50%) translateY(0) scale(1)' 
            : 'translate(-50%, -50%) translateY(-8px) scale(0.98)';
        }
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
          
          // Update content in the inner container
          const innerContainer = this.root.querySelector('div');
          if (innerContainer) {
            this.updateContent(innerContainer);
          }
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
