// ==========================================
// Product Data Layer (PostgreSQL)
// Replacement for PocketBase functions
// ==========================================

import { getProducts, getBrands, getSources } from './db/index';
import { Product, Brand, Source, SearchFilters } from './types/db';

// Re-export types for compatibility
export type { SearchFilters } from './types/db';
export type { Product, Brand, Source } from './types/db';

// Get all brands (using PostgreSQL)
export async function getBrandsList(): Promise<Brand[]> {
  try {
    return await getBrands();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const result = await getProducts(undefined, { limit: 100, offset: 0 });
    return result.items;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// Search products with filters
export async function searchWaterSources(filters: SearchFilters): Promise<Product[]> {
  try {
    const result = await getProducts(filters, { limit: 50, offset: 0 });
    return result.items;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Get products by brand
export async function getProductsByBrandId(brandId: string): Promise<Product[]> {
  try {
    const result = await getProducts({ brands: [brandId] }, { limit: 50, offset: 0 });
    return result.items;
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    return [];
  }
}

// Get products by source type
export async function getProductsBySourceType(sourceType: string): Promise<Product[]> {
  try {
    const result = await getProducts({ types: [sourceType] }, { limit: 50, offset: 0 });
    return result.items;
  } catch (error) {
    console.error("Error fetching products by source type:", error);
    return [];
  }
}

// Get all source types
export async function getSourceTypes(): Promise<string[]> {
  try {
    return await getSources().then(sources => 
      [...new Set(sources.map(s => s.type).filter(Boolean))] as string[]
    );
  } catch (error) {
    console.error("Error fetching source types:", error);
    return [];
  }
}

// Legacy compatibility exports
export { getBrandsList as getBrands };
