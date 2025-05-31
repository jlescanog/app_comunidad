
"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Report } from '@/types';
import { GOOGLE_MAPS_API_KEY, URGENCY_HSL_COLORS } from '@/lib/constants';
import { ReportCardMini } from '@/components/reports/report-card-mini';
import { CategoryIcon } from '@/components/icons/category-icon';
import { MapFilters } from './map-filters';
import { Button } from '../ui/button';
import { LocateFixedIcon } from 'lucide-react';

interface ReportMapProps {
  reports: Report[];
  initialCenter?: { lat: number; lng: number };
  onMarkerClick?: (reportId: string) => void;
  isInteractiveFormMap?: boolean; 
  onMapClick?: (coords: { lat: number; lng: number }) => void; 
  selectedLocation?: { lat: number; lng: number } | null; 
}

export function ReportMap({
  reports,
  initialCenter = { lat: 34.052235, lng: -118.243683 }, 
  onMarkerClick,
  isInteractiveFormMap = false,
  onMapClick,
  selectedLocation,
}: ReportMapProps) {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapZoom, setMapZoom] = useState(isInteractiveFormMap ? 15 : 12);

  const handleMarkerClick = (reportId: string) => {
    setActiveReportId(reportId);
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setMapCenter({ lat: report.location.latitude, lng: report.location.longitude });
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

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-[500px] md:h-[600px] w-full rounded-lg overflow-hidden shadow-lg relative">
        {!isInteractiveFormMap && <MapFilters />}
        <Map
          defaultCenter={initialCenter}
          center={mapCenter}
          defaultZoom={12}
          zoom={mapZoom}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="communitypulse_map"
          onClick={isInteractiveFormMap && onMapClick ? (e) => {
            if(e.detail.latLng) {
              onMapClick({lat: e.detail.latLng.lat, lng: e.detail.latLng.lng})
            }
          } : undefined}
        >
          {!isInteractiveFormMap && reports.map((report) => (
            <AdvancedMarker
              key={report.id}
              position={{ lat: report.location.latitude, lng: report.location.longitude }}
              onClick={() => handleMarkerClick(report.id)}
            >
              <PinIcon report={report} />
            </AdvancedMarker>
          ))}

          {isInteractiveFormMap && selectedLocation && (
             <AdvancedMarker
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
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
  const isCritical = report.urgency === 'Crítica'; // Check against translated value

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
