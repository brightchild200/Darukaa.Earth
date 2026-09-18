import { useEffect, useRef, useCallback, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Site } from '@/types';
import { MapToolbar } from './MapToolbar';
import { MapLegend } from './MapLegend';
import { calculatePolygonArea, getPolygonCenter } from '@/lib/utils';

interface MapViewProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSelectSite: (site: Site | null) => void;
  onSiteCreated?: (polygon: [number, number][], area: number, center: [number, number]) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const statusColors: Record<string, string> = {
  Active: '#6EE7A1',
  Pending: '#F4C95D',
  Completed: '#A7D7B8',
};

export function MapView({
  sites,
  selectedSiteId,
  onSelectSite,
  onSiteCreated,
  center = [0, 20],
  zoom = 3,
  className = '',
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonRefs = useRef<Map<string, L.Polygon>>(new Map());
  const drawPointsRef = useRef<[number, number][]>([]);
  const drawMarkersRef = useRef<L.Marker[]>([]);
  const drawLineRef = useRef<L.Polyline | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleStatuses] = useState<Set<string>>(new Set(['Active', 'Pending', 'Completed']));

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 18,
    });

    // Dark tile layer using CartoDB dark
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Hide default zoom control
    map.on('load', () => {
      setLoading(false);
    });

    // Fallback: hide loading after 2s
    setTimeout(() => setLoading(false), 2000);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render site polygons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing polygons
    polygonRefs.current.forEach((poly) => poly.remove());
    polygonRefs.current.clear();

    sites.forEach((site) => {
      const color = statusColors[site.status] || '#6EE7A1';
      const isSelected = site.id === selectedSiteId;

      const polygon = L.polygon(site.polygon, {
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.35 : 0.12,
        weight: isSelected ? 2.5 : 1.5,
        opacity: isSelected ? 1 : 0.7,
        dashArray: isSelected ? undefined : '4 4',
      });

      polygon.bindTooltip(
        `<div style="font-weight:600;margin-bottom:2px">${site.name}</div><div style="color:#91A49A;font-size:11px">${site.area.toLocaleString()} ha</div>`,
        { direction: 'top', offset: [0, -4], opacity: 1 }
      );

      polygon.on('mouseover', () => {
        if (site.id !== selectedSiteId) {
          polygon.setStyle({ fillOpacity: 0.25, weight: 2 });
        }
      });

      polygon.on('mouseout', () => {
        if (site.id !== selectedSiteId) {
          polygon.setStyle({ fillOpacity: 0.12, weight: 1.5 });
        }
      });

      polygon.on('click', () => {
        onSelectSite(site);
      });

      polygon.addTo(map);
      polygonRefs.current.set(site.id, polygon);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites, selectedSiteId]);

  // Fly to selected site
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedSiteId) return;

    const site = sites.find((s) => s.id === selectedSiteId);
    if (site) {
      map.flyTo(site.center, Math.max(map.getZoom(), 6), {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSiteId, sites]);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  const handleLocate = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (sites.length > 0) {
      const bounds = L.latLngBounds(sites.flatMap((s) => s.polygon));
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2 });
    } else {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [sites, center, zoom]);

  // Drawing mode
  const handleDraw = useCallback(() => {
    setIsDrawing((prev) => {
      const next = !prev;
      const map = mapRef.current;
      if (!map) return next;

      if (next) {
        map.getContainer().style.cursor = 'crosshair';
        map.doubleClickZoom.disable();
      } else {
        map.getContainer().style.cursor = '';
        map.doubleClickZoom.enable();
        // Clear drawing
        drawMarkersRef.current.forEach((m) => m.remove());
        drawMarkersRef.current = [];
        if (drawLineRef.current) {
          drawLineRef.current.remove();
          drawLineRef.current = null;
        }
        drawPointsRef.current = [];
      }
      return next;
    });
  }, []);

  // Handle map click in drawing mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawing) return;

      const point: [number, number] = [e.latlng.lat, e.latlng.lng];
      drawPointsRef.current.push(point);

      // Add marker
      const markerIcon = L.divIcon({
        className: 'draw-point-marker',
        html: `<div style="width:10px;height:10px;border-radius:50%;background:#6EE7A1;border:2px solid #07110D;box-shadow:0 0 8px rgba(110,231,161,0.6)"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      const marker = L.marker(e.latlng, { icon: markerIcon }).addTo(map);
      drawMarkersRef.current.push(marker);

      // Update preview line
      if (drawLineRef.current) {
        drawLineRef.current.remove();
      }
      const linePoints = [...drawPointsRef.current];
      if (drawPointsRef.current.length >= 3) {
        // Close the polygon visually
        linePoints.push(drawPointsRef.current[0]);
      }
      drawLineRef.current = L.polyline(linePoints, {
        color: '#6EE7A1',
        weight: 2,
        opacity: 0.8,
        dashArray: '6 4',
      }).addTo(map);
    };

    const onMapDblClick = () => {
      if (!isDrawing) return;

      const points = drawPointsRef.current;
      if (points.length < 3) return;

      const area = calculatePolygonArea(points);
      const center = getPolygonCenter(points);

      onSiteCreated?.(points, area, center);

      // Cleanup drawing
      drawMarkersRef.current.forEach((m) => m.remove());
      drawMarkersRef.current = [];
      if (drawLineRef.current) {
        drawLineRef.current.remove();
        drawLineRef.current = null;
      }
      drawPointsRef.current = [];
      setIsDrawing(false);
      map.getContainer().style.cursor = '';
      map.doubleClickZoom.enable();
    };

    map.on('click', onMapClick);
    map.on('dblclick', onMapDblClick);

    return () => {
      map.off('click', onMapClick);
      map.off('dblclick', onMapDblClick);
    };
  }, [isDrawing, onSiteCreated]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ background: '#07110D' }}
      />

      {loading && (
        <div className="absolute inset-0 z-[1001] bg-app flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-sm text-muted">Loading environmental data...</p>
        </div>
      )}

      {isDrawing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-elevated/90 backdrop-blur-sm border border-primary/20 rounded-lg px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-fade-in">
          <p className="text-sm text-fg">
            <span className="text-primary font-medium">Drawing mode:</span> Click to place
            boundary points, double-click to complete.
          </p>
        </div>
      )}

      <MapToolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        onDraw={handleDraw}
        isDrawing={isDrawing}
      />

      <MapLegend visibleStatuses={visibleStatuses as Set<'Active' | 'Pending' | 'Completed'>} />
    </div>
  );
}
