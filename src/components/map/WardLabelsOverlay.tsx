import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { PolygonData } from "../../data/polygon-utils";
import { calculateMultiPolygonCentroid } from "../../data/polygon-utils";

interface WardLabelsOverlayProps {
  polygons: PolygonData[];
  visible: boolean;
  zoomLevel: number;
  zoomThreshold: number;
}

interface PolygonCentroid {
  ward: string;
  district: string;
  center: google.maps.LatLng;
}

export default function WardLabelsOverlay({
  polygons,
  visible,
  zoomLevel,
  zoomThreshold
}: WardLabelsOverlayProps) {
  const map = useMap();
  const overlaysRef = useRef<Array<{ overlay: google.maps.OverlayView, wardName: string }>>([]);



  // Create centroids for all polygons
  const createCentroids = useRef((polygonData: PolygonData[]): PolygonCentroid[] => {
    return polygonData.map(polygon => {
      const centroid = calculateMultiPolygonCentroid(polygon);
      return {
        ward: polygon.ward,
        district: polygon.district,
        center: new google.maps.LatLng(centroid.lat, centroid.lng)
      };
    });
  }).current;

  useEffect(() => {
    if (!map || !visible || zoomLevel < zoomThreshold) {
      // Clear existing overlays when not visible or zoom level is too low
      overlaysRef.current.forEach(({ overlay }) => {
        overlay.setMap(null);
      });
      overlaysRef.current = [];
      return;
    }

    // Calculate centroids for all polygons
    const centroids = createCentroids(polygons);

    // Clear existing overlays
    overlaysRef.current.forEach(({ overlay }) => {
      overlay.setMap(null);
    });
    overlaysRef.current = [];

    // Create new overlays for each ward
    centroids.forEach((centroid) => {
      class WardLabelOverlay extends google.maps.OverlayView {
        private container: HTMLDivElement;
        private position: google.maps.LatLng;
        private wardName: string;
        private root: ShadowRoot;

        constructor(
          position: google.maps.LatLng,
          wardName: string,
          /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
          _district: string // Unused parameter, kept for API consistency
        ) {
          super();
          this.position = position;
          this.wardName = wardName;
          
          // Create container with shadow DOM for better style isolation
          this.container = document.createElement('div');
          this.container.style.position = 'absolute';
          this.container.style.pointerEvents = 'none';
          this.container.className = 'ward-label-overlay';
          this.container.style.zIndex = '500'; // Below the hover overlay
          
          // Create shadow DOM
          this.root = this.container.attachShadow({ mode: 'open' });
          
          // Create the content
          this.updateContent();
        }

        onAdd() {
          const panes = this.getPanes()!;
          panes.overlayLayer.appendChild(this.container);
        }

        draw() {
          const overlayProjection = this.getProjection();
          const sw = overlayProjection.fromLatLngToDivPixel(this.position)!;
          
          // Position the overlay
          const div = this.container;
          div.style.left = `${sw.x}px`;
          div.style.top = `${sw.y}px`;
        }
        
        onRemove() {
          if (this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
          }
        }

        updateContent() {
          // Clear previous content
          while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
          }
          
          // Add styles
          const style = document.createElement('style');
          style.textContent = `
            .label-container {
              position: relative;
              transform: translate(-50%, -50%);
              background-color: rgba(255, 255, 255, 0.85);
              border-radius: 4px;
              padding: 4px 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
              user-select: none;
              display: flex;
              flex-direction: column;
              max-width: 120px;
              border: 1px solid rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            }
            
            .ward-name {
              font-weight: 600;
              font-size: 11px;
              color: #333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              letter-spacing: 0.02em;
            }

            @media (min-width: 768px) {
              .ward-name {
                font-size: 12px;
              }
            }
          `;
          
          this.root.appendChild(style);
          
          // Create label container
          const container = document.createElement('div');
          container.className = 'label-container';
          
          // Add ward name
          const nameElement = document.createElement('div');
          nameElement.className = 'ward-name';
          nameElement.textContent = this.wardName;
          container.appendChild(nameElement);
          
          // Add to shadow DOM
          this.root.appendChild(container);
        }
      }

      // Create and add the overlay
      const overlay = new WardLabelOverlay(
        centroid.center,
        centroid.ward,
        centroid.district
      );
      overlay.setMap(map);
      
      // Store reference for cleanup
      overlaysRef.current.push({
        overlay,
        wardName: centroid.ward
      });
    });

    return () => {
      // Clean up overlays
      overlaysRef.current.forEach(({ overlay }) => {
        overlay.setMap(null);
      });
      overlaysRef.current = [];
    };
  }, [map, polygons, visible, zoomLevel, zoomThreshold, createCentroids]);

  return null;
}
