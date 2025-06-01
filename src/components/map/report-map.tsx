
"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { Report } from '@/types';
import { GOOGLE_MAPS_API_KEY, URGENCY_HSL_COLORS, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';
import { ReportCardMini } from '@/components/reports/report-card-mini';
import { CategoryIcon } from '@/components/icons/category-icon';
import { MapFilters } from './map-filters';
import { LocateFixedIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportMapProps {
  reports: Report[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMarkerClick?: (reportId: string) => void;
  isInteractiveFormMap?: boolean; 
  onMapClick?: (coords: { lat: number; lng: number }) => void; 
  selectedLocation?: { lat: number; lng: number } | null; 
}

export function ReportMap({
  reports,
  initialCenter, // This might be overridden by geolocation
  initialZoom,   // This might be overridden
  onMarkerClick,
  isInteractiveFormMap = false,
  onMapClick,
  selectedLocation,
}: ReportMapProps) {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(initialCenter || DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(initialZoom || (isInteractiveFormMap ? 15 : DEFAULT_MAP_ZOOM));
  const [isGeolocating, setIsGeolocating] = useState(!isInteractiveFormMap && !initialCenter); // Geolocate if not form map and no initial center
  const { toast } = useToast();

  useEffect(() => {
    if (!isInteractiveFormMap && !initialCenter && navigator.geolocation) {
      setIsGeolocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          setMapZoom(14); // Zoom in a bit more for user's location
          setIsGeolocating(false);
          toast({ title: "Ubicación Encontrada", description: "Mapa centrado en tu ubicación actual." });
        },
        (error) => {
          console.warn("Error obteniendo geolocalización:", error.message);
          setMapCenter(DEFAULT_MAP_CENTER); // Fallback to Tacna
          setMapZoom(DEFAULT_MAP_ZOOM);
          setIsGeolocating(false);
          if (error.code === error.PERMISSION_DENIED) {
            toast({ title: "Geolocalización Denegada", description: "Mostrando ubicación predeterminada. Habilita los permisos de ubicación para centrar el mapa en tu posición.", variant: "default", duration: 7000 });
          } else {
            toast({ title: "Error de Geolocalización", description: "No se pudo obtener tu ubicación. Mostrando ubicación predeterminada.", variant: "destructive" });
          }
        },
        { timeout: 10000 } // 10 seconds timeout
      );
    } else {
      // If initialCenter is provided or it's an interactive form map, don't geolocate.
      // If initialCenter is provided, it's already set by useState.
      // If it's an interactive map, it usually starts at a default broad view or where the user clicks.
      setIsGeolocating(false);
      if (initialCenter) setMapCenter(initialCenter);
      if (initialZoom) setMapZoom(initialZoom);
    }
  }, [isInteractiveFormMap, initialCenter, initialZoom, toast]);


  const handleMarkerClickInternal = (reportId: string) => {
    setActiveReportId(reportId);
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setMapCenter({ lat: report.location.latitude, lng: report.location.longitude });
      setMapZoom(15); // Zoom in on selected marker
    }
    if (onMarkerClick) {
      onMarkerClick(reportId);
    }
  };
  
  const activeReport = reports.find(report => report.id === activeReportId);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-4 border border-destructive bg-destructive/10 rounded-md text-destructive-foreground">
        <p className="font-semibold">Falta la clave API de Google Maps.</p>
        <p>Por favor, proporciona NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en tus variables de entorno para mostrar el mapa.</p>
      </div>
    );
  }
  
  if (isGeolocating && !isInteractiveFormMap) {
    return (
      <div className="h-[500px] md:h-[600px] w-full rounded-lg shadow-lg flex flex-col items-center justify-center bg-muted/50">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground">Obteniendo tu ubicación...</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-[500px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-lg relative">
        {!isInteractiveFormMap && <MapFilters />}
        <Map
          center={mapCenter}
          zoom={mapZoom}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="communitypulse_map_main"
          onClick={isInteractiveFormMap && onMapClick ? (e) => {
            if(e.detail.latLng) {
              onMapClick({lat: e.detail.latLng.lat, lng: e.detail.latLng.lng})
            }
          } : undefined}
          onBoundsChanged={(e) => {
            if (!isInteractiveFormMap) { // Only update center/zoom if not in form mode
              const newCenter = e.map.getCenter();
              if (newCenter) {
                setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
              }
              setMapZoom(e.map.getZoom() || DEFAULT_MAP_ZOOM);
            }
          }}
        >
          {!isInteractiveFormMap && reports.map((report) => (
            <AdvancedMarker
              key={report.id}
              position={{ lat: report.location.latitude, lng: report.location.longitude }}
              onClick={() => handleMarkerClickInternal(report.id)}
            >
              <PinIcon report={report} />
            </AdvancedMarker>
          ))}

          {isInteractiveFormMap && selectedLocation && (
             <AdvancedMarker
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            >
               <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md transform -translate-x-1/2 -translate-y-full">
                <LocateFixedIcon className="w-5 h-5 text-primary-foreground" />
              </div>
            </AdvancedMarker>
          )}

          {activeReport && !isInteractiveFormMap && (
            <InfoWindow
              position={{ lat: activeReport.location.latitude, lng: activeReport.location.longitude }}
              onCloseClick={() => setActiveReportId(null)}
              minWidth={300}
            >
              <ReportCardMini report={activeReport} />
            </InfoWindow>
          )}
        </Map>
        {isInteractiveFormMap && <MapInstructions />}
      </div>
    </APIProvider>
  );
}

function PinIcon({ report }: { report: Report }) {
  const pinColor = URGENCY_HSL_COLORS[report.urgency] || 'hsl(var(--muted))';
  const isCritical = report.urgency === 'Crítica';

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer transform transition-transform hover:scale-110
        ${isCritical ? 'animate-pulse-border' : ''}`}
      style={{ 
        backgroundColor: pinColor,
        borderColor: isCritical ? 'hsl(var(--destructive))' : 'transparent',
        borderWidth: isCritical ? '2px' : '0px',
        boxShadow: isCritical ? `0 0 8px ${URGENCY_HSL_COLORS.Crítica}` : '0 2px 4px rgba(0,0,0,0.2)',
       }}
    >
      <CategoryIcon category={report.category} className="w-4 h-4 text-primary-foreground" />
      <style jsx>{`
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0 rgba(255,0,0, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255,0,0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255,0,0, 0); }
        }
        .animate-pulse-border {
          animation: pulse-border 2s infinite;
        }
      `}</style>
    </div>
  );
}


function MapInstructions() {
  return (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-background/80 p-2 rounded-md shadow text-sm text-foreground backdrop-blur-sm">
      Haz clic en el mapa para seleccionar la ubicación del incidente.
    </div>
  );
}

