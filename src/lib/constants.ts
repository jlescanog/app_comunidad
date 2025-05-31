
import type { ReportCategory, ReportUrgency } from '@/types';

export const REPORT_CATEGORIES: ReportCategory[] = [
  'Infraestructura',
  'Obstáculos',
  'Vehículos Abandonados',
  'Problemas de Drenaje',
  'Contaminación',
  'Animales Abandonados',
  'Inseguridad',
  'Violencia',
  'Accidentes',
  'Otro',
];

export const REPORT_URGENCIES: ReportUrgency[] = [
  'Baja',
  'Media',
  'Alta',
  'Urgente',
  'Crítica',
];

export const DISTRICTS_OF_RESIDENCE: string[] = [
  "Distrito Central",
  "Extremo Norte",
  "Lado Sur",
  "Distrito Oeste", // Westwood
  "Puerta Este",    // Eastgate
  "Valle del Río",  // Riverdale
];

export const URGENCY_COLORS: Record<ReportUrgency, string> = {
  'Baja': 'bg-green-500',
  'Media': 'bg-yellow-500',
  'Alta': 'bg-orange-500',
  'Urgente': 'bg-red-600',
  'Crítica': 'bg-black',
};

export const URGENCY_HSL_COLORS: Record<ReportUrgency, string> = {
  'Baja': 'hsl(var(--chart-2))',
  'Media': 'hsl(var(--chart-4))',
  'Alta': 'hsl(var(--chart-5))',
  'Urgente': 'hsl(var(--destructive))',
  'Crítica': 'hsl(0 0% 0%)', // Black
};

export const MAX_REPORT_DESCRIPTION_LENGTH = 1000; 
export const MAX_VIDEO_DURATION_SECONDS = 15;
export const MAX_PHOTO_UPLOADS = 5;

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
