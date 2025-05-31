
import type { Report, User } from "@/types";

export const MOCK_USER_LOGGED_IN: User = {
  id: "user-123",
  name: "Juana Pérez", // Translated name
  email: "juana.perez@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  role: "citizen", // Role might need translation if displayed
  district: "Distrito Central", // Translated district
};

export const MOCK_USER_MODERATOR: User = {
  id: "mod-456",
  name: "Juan García", // Translated name
  email: "juan.garcia@example.com",
  role: "moderator",
};


export const MOCK_REPORTS: Report[] = [
  {
    id: "report-1",
    userId: "user-123",
    user: MOCK_USER_LOGGED_IN,
    category: "Infraestructura",
    description: "Gran bache en la Calle Principal cerca de la panadería. Muy peligroso para los ciclistas.",
    urgency: "Alta",
    location: { latitude: 34.052235, longitude: -118.243683, address: "Calle Principal 123, CualquierCiudad" }, 
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "pothole road" }],
    status: "Pendiente",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 15,
    downvotes: 1,
    currentUserVote: "up",
  },
  {
    id: "report-2",
    userId: "user-456",
    category: "Vehículos Abandonados",
    description: "Sedán azul estacionado durante más de una semana, parece abandonado. Matrícula ABC-123.",
    urgency: "Media",
    location: { latitude: 34.055000, longitude: -118.245000, address: "Av. Roble 456, CualquierCiudad" }, 
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "abandoned car" }],
    status: "En Proceso",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), 
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: "report-3",
    userId: "user-789",
    category: "Contaminación",
    description: "Vertido ilegal de basura en el parque cerca del río.",
    urgency: "Urgente",
    location: { latitude: 34.050000, longitude: -118.240000, address: "Camino del Parque 789, CualquierCiudad" }, 
    media: [
      { type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "trash pollution" },
      { type: "video", url: "https://placehold.co/600x400.png", thumbnailUrl: "https://placehold.co/150x100.png", dataAiHint: "dumping video" }
    ],
    status: "Resuelto",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    upvotes: 25,
    downvotes: 2,
  },
    {
    id: "report-4",
    userId: "user-101",
    category: "Animales Abandonados",
    description: "Un perro pequeño parece perdido y asustado, deambulando cerca del centro comunitario.",
    urgency: "Crítica",
    location: { latitude: 34.053000, longitude: -118.248000, address: "Centro Comunitario, CualquierCiudad" },
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "lost dog" }],
    status: "Pendiente",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 8,
    downvotes: 0,
  },
];
