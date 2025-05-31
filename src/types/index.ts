export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl?: string;
  role: 'citizen' | 'moderator' | 'admin';
  district?: string; // From predefined list
  birthDate?: string; // ISO Date string
}

export type ReportCategory = 
  | 'Infrastructure' 
  | 'Obstacles' 
  | 'Abandoned Vehicles' 
  | 'Drainage Issues' 
  | 'Pollution' 
  | 'Abandoned Animals' 
  | 'Insecurity' 
  | 'Violence' 
  | 'Accidents' 
  | 'Other';

export type ReportUrgency = 'Low' | 'Medium' | 'High' | 'Urgent' | 'Critical';

export type ReportStatus = 'Pending' | 'In Process' | 'Solved' | 'Invalid' | 'Duplicate';

export interface ReportLocation {
  latitude: number;
  longitude: number;
  address?: string; // Optional, reverse geocoded
}

export interface ReportMedia {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // For videos
}

export interface Report {
  id: string;
  userId: string;
  user?: User; // Populated for display
  category: ReportCategory;
  subCategory?: string;
  description: string;
  urgency: ReportUrgency;
  location: ReportLocation;
  media: ReportMedia[];
  status: ReportStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  upvotes: number;
  downvotes: number;
  currentUserVote?: 'up' | 'down' | null; // For logged-in user's vote status
  internalComments?: Array<{ userId: string; comment: string; createdAt: string }>; // For moderators/admins
}
