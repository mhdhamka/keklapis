// ==========================================
// Database Types Definition
// ==========================================

export type ProductStatus = "pending" | "approved" | "rejected";
export type ProductCakeType = "layered-cake";
export type SourceType = "bakery";

export interface FlatProductRecord {
  id: string;
  brand: string;
  type: ProductCakeType;
  product_name: string | null;
  culinary_profile: string | null;
  parent_company: string | null;
  website_url: string | null;
  manufacturer: string | null;
  manufacturer_address: string | null;
  barcode: string | null;
  sweetness: number | null;
  richness_dri: number | null;
  ingredients_mg_l: Record<string, number | null>;
  source_name: string | null;
  source_type: string | null;
  source_address: string | null;
  latitude: number | null;
  longitude: number | null;
  kkm_approval_number: string | null;
  country: string;
  image: string;
  status: ProductStatus;
  submitted_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  bakery_origin?: string | null;
  layers_count?: number | null;
}

export interface BaseModel {
  id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Brand extends BaseModel {
  brand_name: string;
  parent_company: string | null;
  website_url: string | null;
}

export interface Manufacturer extends BaseModel {
  name: string;
  address: string | null;
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

// Compatibility view consumed by the existing UI and public APIs.
export interface Product extends BaseModel {
  brand_id: string;
  manufacturer_id: string;
  source_id: string;
  submitted_by: string | null;
  product_name: string | null;
  culinary_profile: string | null;
  cake_type: ProductCakeType;
  barcode: string | null;
  sweetness: number | null;
  richness_dri: number | null;
  ingredients_json: Array<{
    name: string;
    unit: string;
    amount: number;
  }>;
  status: ProductStatus;
  image: string;
  brand?: Brand;
  manufacturer?: Manufacturer;
  source?: Source;
  images?: ImageView[];
  bakery_origin?: string | null;
  layers_count?: number | null;
}

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