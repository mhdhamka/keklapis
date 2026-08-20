// ==========================================
// Products Database Utility
// ==========================================

import { getAll, insert, update, remove } from "@/lib/json-store";
import type {
  Brand,
  FlatProductRecord,
  Manufacturer,
  PaginatedResponse,
  Product,
  ProductCakeType,
  SearchFilters,
  Source,
  SourceType,
} from "@/lib/types/db";

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sourceType(value: string | null): SourceType | null {
  const values: Record<string, SourceType> = {
    bakery: "bakery",
  };
  return value ? values[value] ?? null : null;
}

function ingredientName(key: string): string {
  return key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function expandProduct(raw: FlatProductRecord): Product {
  const brandId = slugify(raw.brand);
  const manufacturerId = slugify(raw.manufacturer ?? "unknown");
  const sourceId = slugify(raw.source_name ?? raw.id);
  const brand: Brand = {
    id: brandId,
    brand_name: raw.brand,
    parent_company: raw.parent_company,
    website_url: raw.website_url,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
  const manufacturer: Manufacturer = {
    id: manufacturerId,
    name: raw.manufacturer ?? "Unknown",
    address: raw.manufacturer_address,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
  const source: Source = {
    id: sourceId,
    source_name: raw.source_name,
    type: sourceType(raw.source_type),
    location_address: raw.source_address,
    lat: raw.latitude,
    lng: raw.longitude,
    kkm_approval_number: raw.kkm_approval_number,
    country: raw.country,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };

  // Transform ingredients map into an array so components can loop through them safely
  const ingredientsArray = Object.entries(raw.ingredients_mg_l ?? {}).map(([key, amount]) => ({
    name: ingredientName(key),
    unit: "g",
    amount: Number(amount) || 0,
  }));

  const item = raw as any;

  return {
    id: raw.id,
    brand_id: brandId,
    manufacturer_id: manufacturerId,
    source_id: sourceId,
    submitted_by: raw.submitted_by,
    product_name: raw.product_name,
    culinary_profile: raw.culinary_profile ?? null,
    cake_type: raw.type,
    barcode: raw.barcode,
    sweetness: raw.sweetness,
    richness_dri: raw.richness_dri,
    ingredients_json: ingredientsArray, 
    status: raw.status,
    image: raw.image,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    brand,
    manufacturer,
    source,
    bakery_origin: item.bakery_origin ?? null,
    layers_count: item.layers_count ?? null,
    images: [{ id: raw.id, filename: raw.image, url: raw.image === "placeholder.svg" ? "/placeholder.svg" : `/images/products/${raw.image}` }],
  } as Product;
}

function matches(product: Product, filters: SearchFilters): boolean {
  if (filters.query) {
    const query = filters.query.toLowerCase();
    if (![product.product_name, product.barcode, product.brand?.brand_name, product.culinary_profile]
      .some((value) => (value ?? "").toLowerCase().includes(query))) return false;
  }
  if (filters.types?.length && !filters.types.includes(product.source?.type ?? "")) return false;
  if (filters.excludedTypes?.includes(product.source?.type ?? "")) return false;
  if (filters.brands?.length && !filters.brands.includes(product.brand_id)) return false;
  if (filters.excludedBrands?.includes(product.brand_id)) return false;
  if (filters.culinaryProfiles?.length && (!product.culinary_profile || !filters.culinaryProfiles.includes(product.culinary_profile))) return false;
  if (filters.minSweetness !== undefined && filters.minSweetness > 0 && (product.sweetness === null || product.sweetness < filters.minSweetness)) return false;
  if (filters.maxSweetness !== undefined && filters.maxSweetness < 10 && (product.sweetness === null || product.sweetness > filters.maxSweetness)) return false;
  if (filters.minRichnessDri !== undefined && filters.minRichnessDri > 0 && (product.richness_dri === null || product.richness_dri < filters.minRichnessDri)) return false;
  if (filters.maxRichnessDri !== undefined && filters.maxRichnessDri < 100 && (product.richness_dri === null || product.richness_dri > filters.maxRichnessDri)) return false;
  return true;
}

export async function getProducts(
  filters?: SearchFilters,
  options?: { limit?: number; offset?: number }
): Promise<PaginatedResponse<Product>> {
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;
  let products = (await getAll("products"))
    .map(expandProduct)
    .filter((product) => product.status === "approved");
  if (filters) products = products.filter((product) => matches(product, filters));
  products.sort((a, b) => (a.product_name ?? "").localeCompare(b.product_name ?? ""));
  return {
    items: products.slice(offset, offset + limit),
    total: products.length,
    page: Math.floor(offset / limit) + 1,
    perPage: limit,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const raw = (await getAll("products")).find((product) => product.id === id);
  return raw ? expandProduct(raw) : null;
}

type ProductInput = Omit<Partial<FlatProductRecord>, "brand" | "manufacturer"> & {
  brand?: string | Brand;
  manufacturer?: string | Manufacturer;
  cake_type?: ProductCakeType;
  culinary_profile?: string | null;
  sweetness?: number | null;
  richness_dri?: number | null;
  bakery_origin?: string | null;
  layers_count?: number | null;
};

export async function createProduct(data: ProductInput): Promise<Product> {
  const brand = typeof data.brand === "string" ? data.brand : data.brand?.brand_name;
  const type = data.type ?? data.cake_type ?? "traditional";
  if (!brand) {
    throw new Error("A brand is required");
  }
  const id = `${slugify(brand)}-${slugify(data.product_name || "product")}`;
  if ((await getAll("products")).some((product) => product.id === id)) {
    throw new Error(`Product ${id} already exists`);
  }
  const timestamp = new Date().toISOString();
  const record: FlatProductRecord = {
    id,
    brand,
    type,
    product_name: data.product_name ?? null,
    culinary_profile: data.culinary_profile ?? null,
    parent_company: data.parent_company ?? null,
    website_url: data.website_url ?? null,
    manufacturer: typeof data.manufacturer === "string" ? data.manufacturer : data.manufacturer?.name ?? null,
    manufacturer_address: data.manufacturer_address ?? null,
    barcode: data.barcode ?? null,
    sweetness: data.sweetness ?? null,
    richness_dri: data.richness_dri ?? null,
    ingredients_mg_l: data.ingredients_mg_l ?? {},
    source_name: data.source_name ?? null,
    source_type: data.source_type ?? null,
    source_address: data.source_address ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    kkm_approval_number: data.kkm_approval_number ?? null,
    country: data.country ?? "Malaysia",
    image: `${id}.webp`,
    status: data.status ?? "pending",
    submitted_by: data.submitted_by ?? null,
    created_at: timestamp,
    updated_at: timestamp,
    ...({
      bakery_origin: data.bakery_origin ?? null,
      layers_count: data.layers_count ?? null,
    } as any),
  };
  return expandProduct(await insert("products", record));
}

export async function updateProduct(id: string, data: ProductInput): Promise<Product | null> {
  const patch: Partial<FlatProductRecord> = {};
  if (data.product_name !== undefined) patch.product_name = data.product_name;
  if (data.culinary_profile !== undefined) patch.culinary_profile = data.culinary_profile;
  if (data.parent_company !== undefined) patch.parent_company = data.parent_company;
  if (data.website_url !== undefined) patch.website_url = data.website_url;
  if (typeof data.manufacturer === "string") patch.manufacturer = data.manufacturer;
  if (data.manufacturer_address !== undefined) patch.manufacturer_address = data.manufacturer_address;
  if (data.barcode !== undefined) patch.barcode = data.barcode;
  if (data.sweetness !== undefined) patch.sweetness = data.sweetness;
  if (data.richness_dri !== undefined) patch.richness_dri = data.richness_dri;
  if (data.ingredients_mg_l !== undefined) patch.ingredients_mg_l = data.ingredients_mg_l;
  if (data.source_name !== undefined) patch.source_name = data.source_name;
  if (data.source_type !== undefined) patch.source_type = data.source_type;
  if (data.source_address !== undefined) patch.source_address = data.source_address;
  if (data.latitude !== undefined) patch.latitude = data.latitude;
  if (data.longitude !== undefined) patch.longitude = data.longitude;
  if (data.kkm_approval_number !== undefined) patch.kkm_approval_number = data.kkm_approval_number;
  if (data.country !== undefined) patch.country = data.country;
  if (data.status !== undefined) patch.status = data.status;
  if (data.bakery_origin !== undefined) (patch as any).bakery_origin = data.bakery_origin;
  if (data.layers_count !== undefined) (patch as any).layers_count = data.layers_count;
  
  const raw = await update("products", (product) => product.id === id, patch);
  return raw ? expandProduct(raw) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  return (await remove("products", (product) => product.id === id)) > 0;
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
  return (await getProducts({ brands: [brandId] }, { limit: 500 })).items;
}

export async function getProductsBySource(sourceId: string): Promise<Product[]> {
  return (await getAll("products"))
    .map(expandProduct)
    .filter((product) => product.status === "approved" && product.source_id === sourceId);
}