
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl?: string;
  role: 'citizen' | 'moderator' | 'admin'; // Consider translating roles if displayed in UI
  district?: string; 
  birthDate?: string; 
}

export type ReportCategory = 
  | 'Infraestructura' 
  | 'Obstáculos' 
  | 'Vehículos Abandonados' 
  | 'Problemas de Drenaje' 
  | 'Contaminación' 
  | 'Animales Abandonados' 
  | 'Inseguridad' 
  | 'Violencia' 
  | 'Accidentes' 
  | 'Otro';

export type ReportUrgency = 'Baja' | 'Media' | 'Alta' | 'Urgente' | 'Crítica';

export type ReportStatus = 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Inválido' | 'Duplicado';

export interface ReportLocation {
  latitude: number;
  longitude: number;
  address?: string; 
}

export interface ReportMedia {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; 
  dataAiHint?: string; // Keep hints in English for image search consistency
}

export interface Report {
  id: string;
  userId: string;
  user?: User; 
  category: ReportCategory;
  subCategory?: string;
  description: string;
  urgency: ReportUrgency;
  location: ReportLocation;
  media: ReportMedia[];
  status: ReportStatus;
  createdAt: string; 
  updatedAt: string; 
  upvotes: number;
  downvotes: number;
  currentUserVote?: 'up' | 'down' | null; 
  internalComments?: Array<{ userId: string; comment: string; createdAt: string }>; 
}
