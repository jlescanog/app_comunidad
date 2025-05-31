import type { ReportCategory, ReportUrgency } from '@/types';

export const REPORT_CATEGORIES: ReportCategory[] = [
  'Infrastructure',
  'Obstacles',
  'Abandoned Vehicles',
  'Drainage Issues',
  'Pollution',
  'Abandoned Animals',
  'Insecurity',
  'Violence',
  'Accidents',
  'Other',
];

export const REPORT_URGENCIES: ReportUrgency[] = [
  'Low',
  'Medium',
  'High',
  'Urgent',
  'Critical',
];

// Example list of districts, expand as needed
export const DISTRICTS_OF_RESIDENCE: string[] = [
  "Central District",
  "North End",
  "Southside",
  "Westwood",
  "Eastgate",
  "Riverdale",
  // Add more districts as per the specific community/city
];

export const URGENCY_COLORS: Record<ReportUrgency, string> = {
  Low: 'bg-green-500', // Or use theme variables like 'bg-[hsl(var(--chart-2))]'
  Medium: 'bg-yellow-500', // 'bg-[hsl(var(--chart-4))]'
  High: 'bg-orange-500', // 'bg-[hsl(var(--chart-5))]'
  Urgent: 'bg-red-600', // 'bg-destructive'
  Critical: 'bg-black', // Special styling for border and animation needed
};

export const URGENCY_HSL_COLORS: Record<ReportUrgency, string> = {
  Low: 'hsl(var(--chart-2))',
  Medium: 'hsl(var(--chart-4))',
  High: 'hsl(var(--chart-5))',
  Urgent: 'hsl(var(--destructive))',
  Critical: 'hsl(0 0% 0%)', // Black
};

export const MAX_REPORT_DESCRIPTION_LENGTH = 1000; // Approx 200 words
export const MAX_VIDEO_DURATION_SECONDS = 15;
export const MAX_PHOTO_UPLOADS = 5;

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
