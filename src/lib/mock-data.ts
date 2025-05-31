import type { Report, User } from "@/types";

export const MOCK_USER_LOGGED_IN: User = {
  id: "user-123",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  role: "citizen",
  district: "Central District",
};

export const MOCK_USER_MODERATOR: User = {
  id: "mod-456",
  name: "John Smith",
  email: "john.smith@example.com",
  role: "moderator",
};


export const MOCK_REPORTS: Report[] = [
  {
    id: "report-1",
    userId: "user-123",
    user: MOCK_USER_LOGGED_IN,
    category: "Infrastructure",
    description: "Large pothole on Main Street near the bakery. Very dangerous for cyclists.",
    urgency: "High",
    location: { latitude: 34.052235, longitude: -118.243683, address: "123 Main St, Anytown" }, // Los Angeles
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "pothole road" }],
    status: "Pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 15,
    downvotes: 1,
    currentUserVote: "up",
  },
  {
    id: "report-2",
    userId: "user-456",
    category: "Abandoned Vehicles",
    description: "Blue sedan parked for over a week, looks abandoned. License plate ABC-123.",
    urgency: "Medium",
    location: { latitude: 34.055000, longitude: -118.245000, address: "456 Oak Ave, Anytown" }, // Near LA
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "abandoned car" }],
    status: "In Process",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: "report-3",
    userId: "user-789",
    category: "Pollution",
    description: "Illegal dumping of trash in the park near the river.",
    urgency: "Urgent",
    location: { latitude: 34.050000, longitude: -118.240000, address: "789 Park Rd, Anytown" }, // LA vicinity
    media: [
      { type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "trash pollution" },
      { type: "video", url: "https://placehold.co/600x400.png", thumbnailUrl: "https://placehold.co/150x100.png", dataAiHint: "dumping video" }
    ],
    status: "Solved",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    upvotes: 25,
    downvotes: 2,
  },
    {
    id: "report-4",
    userId: "user-101",
    category: "Abandoned Animals",
    description: "A small dog seems lost and scared, wandering near the community center.",
    urgency: "Critical",
    location: { latitude: 34.053000, longitude: -118.248000, address: "Community Center, Anytown" },
    media: [{ type: "image", url: "https://placehold.co/600x400.png", dataAiHint: "lost dog" }],
    status: "Pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    upvotes: 8,
    downvotes: 0,
  },
];
