// API Service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('accessToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      return {
        ok: false,
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network request failed',
        },
      };
    }
  }

  // Auth endpoints
  async register(email: string, password: string, fullName?: string, role?: string, pharmacyName?: string, pharmacyAddress?: string, phone?: string) {
    return this.request<{
      userId: string;
      email: string;
      pharmacyId?: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role, pharmacyName, pharmacyAddress, phone }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        fullName?: string;
        role: string;
        avatarUrl?: string;
        pharmacyId?: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return {
        ok: false,
        data: null,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'No refresh token available',
        },
      };
    }

    const response = await this.request<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Medicine endpoints
  async getMedicines(pharmacyId?: string) {
    const query = pharmacyId ? `?pharmacyId=${pharmacyId}` : '';
    return this.request<any[]>('/medicines' + query);
  }

  async createMedicine(data: { name: string; quantity?: number; pharmacyId?: string }) {
    return this.request<any>('/medicines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMedicine(id: string, data: { name?: string; quantity?: number }) {
    return this.request<any>(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMedicine(id: string) {
    return this.request<{ success: boolean }>(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  // Pharmacy endpoints
  async getPharmacies(medicineName?: string) {
    const query = medicineName ? `?medicineName=${encodeURIComponent(medicineName)}` : '';
    return this.request<any[]>('/pharmacies' + query);
  }

  async getPharmacyById(id: string) {
    return this.request<any>(`/pharmacies/${id}`);
  }

  async getPharmacyByName(name: string) {
    const response = await this.getPharmacies();
    if (response.ok && response.data) {
      const pharmacy = response.data.find(
        (p: any) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (pharmacy) {
        return {
          ok: true,
          data: pharmacy,
          error: null,
        };
      }
      return {
        ok: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Pharmacy not found',
        },
      };
    }
    return response;
  }

  async createPharmacy(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    isVerified?: boolean;
    openHours?: any;
  }) {
    return this.request<any>('/pharmacies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePharmacy(id: string, data: any) {
    return this.request<any>(`/pharmacies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { ApiResponse };

