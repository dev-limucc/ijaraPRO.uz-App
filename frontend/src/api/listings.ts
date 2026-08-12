import axios from 'axios';
import { Listing, CreateListingData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const listingsApi = {
  getNearby: async (lat: number, lng: number, filters?: {
    category?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    radius?: number;
  }): Promise<Listing[]> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.radius) params.append('radius', filters.radius.toString());
    
    const response = await axios.get(`${API_BASE_URL}/listings/nearby?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<Listing> => {
    const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
    return response.data;
  },

  create: async (data: CreateListingData): Promise<Listing> => {
    const response = await axios.post(`${API_BASE_URL}/listings`, data);
    return response.data;
  },
};

export const uploadApi = {
  uploadMultiple: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await axios.post(`${API_BASE_URL}/upload/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls;
  },
};

