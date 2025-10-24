export interface Medicine {
  id: string;
  name: string;
  stock: 'in_stock' | 'out_of_stock' | 'low_stock';
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
}

export interface OpenHours {
  [key: string]: { open: string; close: string; closed?: boolean };
}


export interface PharmacyInventory {
  id: string;
  pharmacyId: string;
  medicineId: string;
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
  quantity?: number;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'user' | 'pharmacist';
  avatarUrl?: string;
}

export type ViewMode = 'home' | 'search' | 'medicine' | 'pharmacy' | 'pharmacist-login' | 'pharmacist-dashboard';
