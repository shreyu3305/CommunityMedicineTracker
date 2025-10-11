export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler' | 'other';
  strength?: string;
  manufacturer?: string;
  description?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  isVerified: boolean;
  openHours?: OpenHours;
  logoUrl?: string;
  distance?: number;
}

export interface OpenHours {
  [key: string]: { open: string; close: string; closed?: boolean };
}

export interface AvailabilityReport {
  id: string;
  medicineId: string;
  pharmacyId: string;
  status: 'in_stock' | 'out_of_stock' | 'unknown';
  notes?: string;
  photoUrl?: string;
  isVerified: boolean;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyInventory {
  id: string;
  pharmacyId: string;
  medicineId: string;
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
  quantity?: number;
  price?: number;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'user' | 'pharmacist';
  avatarUrl?: string;
}

export type ViewMode = 'home' | 'search' | 'medicine' | 'pharmacy' | 'login';
