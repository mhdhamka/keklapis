// ==========================================
// Database & Prisma Model Type Definitions
// lib/types/db.ts
// ==========================================

import type { Product as PrismaProduct, Brand as PrismaBrand, User as PrismaUser } from "@prisma/client";

export type ProductStatus = "pending" | "approved" | "rejected";
export type ProductCakeType = "layered-cake" | "traditional";
export type SourceType = "bakery";

export type { PrismaProduct, PrismaBrand, PrismaUser };

export interface BaseModel {
  id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Brand extends BaseModel {
  brand_name: string;
  parent_company?: string | null;
  website_url?: string | null;
}

export interface Manufacturer extends BaseModel {
  name: string;
  address?: string | null;
}

export interface Source extends BaseModel {
  source_name: string | null;
  type: SourceType | null;
  location_address: string | null;
  lat: number | null;
  lng: number | null;
  kkm_approval_number: string | null;
  country: string;
}

export interface Image {
  id: string;
  filename: string;
  mime_type: string;
  ext: string;
  size_bytes: number | null;
  created_at: string | null;
}

export interface ImageView {
  id: string;
  filename: string;
  url: string;
}

export interface Product extends BaseModel {
  brand_id?: string;
  manufacturer_id?: string;
  source_id?: string;
  submitted_by: string | null;
  product_name: string | null;
  culinary_profile: string | null;
  cake_type: ProductCakeType;
  type?: string;
  barcode: string | null;
  sweetness: number | null;
  richness_dri: number | null;
  ingredients_json?: Array<{
    name: string;
    unit: string;
    amount: number;
  }>;
  ingredients_mg_l?: Record<string, number | null>;
  status: ProductStatus;
  image: string;
  
  // Clean relational & flat properties to satisfy both UI components and DB mappers without union friction
  brand?: Brand;
  brand_name?: string;
  parent_company?: string | null;
  website_url?: string | null;

  manufacturer?: Manufacturer;
  manufacturer_name?: string;
  manufacturer_address?: string | null;

  source?: Source;
  source_name?: string | null;
  source_type?: SourceType | string | null;
  source_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  kkm_approval_number?: string | null;
  country?: string;

  images?: ImageView[];
  bakery_origin?: string | null;
  layers_count?: number | null;
  cake_category?: string | null; 
  sourceType?: string | null;    
  taste_vector?: number[];
}

export interface FlatProductRecord extends Product {}

export interface IngredientComposition {
  [ingredientName: string]: number;
}

export interface SearchFilters {
  query?: string;
  types?: string[];
  excludedTypes?: string[];
  brands?: string[];
  excludedBrands?: string[];
  culinaryProfiles?: string[];
  minSweetness?: number;
  maxSweetness?: number;
  minRichnessDri?: number;
  maxRichnessDri?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}