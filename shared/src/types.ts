export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_new: boolean;
  is_vegetarian: boolean;
  is_spicy: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  [key: string]: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

export interface Stats {
  categories: number;
  items: number;
  popular: number;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}

export interface ApiError {
  error: string;
}
