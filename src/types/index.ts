export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler' | 'other';
  strength?: string;
  manufacturer?: string;
  description?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  dosage?: {
    adults: string;
    children: string;
    elderly: string;
  };
  sideEffects?: string[];
  interactions?: string[];
  warnings?: string[];
  storage?: string;
  expiry?: string;
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating?: number;
  reviewCount?: number;
  images?: string[];
}

export interface MedicineCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  medicineCount: number;
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
  confidenceScore?: number;
  lastUpdated?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
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
