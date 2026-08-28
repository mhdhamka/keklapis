export interface BrandRecord {
  id: string;
  brand_name: string;
  parent_company?: string | null;
  website_url?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ManufacturerRecord {
  id: string;
  name: string;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SourceRecord {
  id: string;
  source_name: string | null;
  type: string | null;
  location_address: string | null;
  lat: number | null;
  lng: number | null;
  kkm_approval_number: string | null;
  country: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductRecord {
  id: string;
  brand: string | null;
  brand_name?: string | null;
  parent_company?: string | null;
  website_url?: string | null;
  type?: string | null;
  cake_type?: string;
  product_name: string | null;
  culinary_profile: string | null;
  manufacturer: string | null;
  manufacturer_address?: string | null;
  barcode: string | null;
  sweetness: number | null;
  richness_dri: number | null;
  ingredients_mg_l?: Record<string, number | null> | null;
  source_name?: string | null;
  source_type?: string | null;
  sourceType?: string | null;
  source_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  kkm_approval_number?: string | null;
  country?: string | null;
  image: string;
  status: string;
  submitted_by?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserRecord {
  id: string;
  email: string;
  email_verified: string | null;
  name: string | null;
  image: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Contract {
  products: ProductRecord[];
  brands?: BrandRecord[];
  manufacturers?: ManufacturerRecord[];
  sources?: SourceRecord[];
  users: UserRecord[];
}