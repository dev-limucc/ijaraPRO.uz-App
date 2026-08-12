export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  area?: number;
  rooms?: number;
  maxPeople?: number;
  category: string;
  tags: string[];
  description?: string;
  address?: string;
  name: string;
  phoneNumber: string;
  lat: number;
  lng: number;
  images: ListingImage[];
  createdAt: string;
  distance?: number;
}

export interface ListingImage {
  id: string;
  url: string;
  listingId: string;
}

export interface CreateListingData {
  title: string;
  price: number;
  currency: string;
  area?: number;
  rooms?: number;
  maxPeople?: number;
  category: string;
  tags: string[];
  description?: string;
  address?: string;
  name: string;
  phoneNumber: string;
  lat: number;
  lng: number;
  imageUrls: string[];
}

export type Currency = 'UZS' | 'USD' | 'EUR';

export interface Filters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  radius?: number;
}

export type Category = 'house' | 'school' | 'office' | 'market' | 'shopping_center';
export type Tag = 'for_students' | 'for_workers' | 'for_office_staff' | 'for_sellers';

