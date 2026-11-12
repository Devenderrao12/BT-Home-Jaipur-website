export type PropertyStatus = 'available' | 'sold' | 'featured' | 'on_hold';
export type ListingType = 'sale' | 'rent';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  is_primary: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category_id?: string | null;
  location_id?: string | null;
  address?: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  price_per_sqft?: number | null;
  is_price_negotiable: boolean;
  area_sqft?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  floor_number?: number | null;
  total_floors?: number | null;
  facing?: string | null;
  furnishing?: string | null;
  listing_type: ListingType;
  monthly_rent?: number | null;
  status: PropertyStatus;
  is_featured: boolean;
  amenities: string[];
  video_url?: string | null;
  views_count: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  location?: Location;
  images?: PropertyImage[];
  tags?: Tag[];
}

export interface Lead {
  id: string;
  property_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  source: string;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'converted' | 'closed';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_photo_url?: string | null;
  rating: number;
  message: string;
  is_published: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  author: string;
  is_published: boolean;
  published_at: string;
}

export interface GalleryItem {
  id: string;
  title?: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  sort_order: number;
}
