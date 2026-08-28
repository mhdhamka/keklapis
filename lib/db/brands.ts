import { getAll, write } from "@/lib/json-store";
import type { Brand } from "@/lib/types/db";
import { slugify } from "./products";

export async function getBrands(): Promise<Brand[]> {
  const products = await getAll("products");
  const brands = new Map<string, Brand>();
  for (const product of products) {
    const brandName = typeof product.brand === "string" ? product.brand : product.brand?.brand_name;
    if (!brandName) continue;
    const id = slugify(brandName);
    if (!brands.has(id)) brands.set(id, {
      id,
      brand_name: brandName,
      parent_company: product.parent_company ?? null,
      website_url: product.website_url ?? null,
      created_at: product.created_at ?? null,
      updated_at: product.updated_at ?? null,
    });
  }
  return [...brands.values()].sort((a, b) => a.brand_name.localeCompare(b.brand_name));
}

export async function getBrandById(id: string): Promise<Brand | null> {
  return (await getBrands()).find((brand) => brand.id === id) ?? null;
}

export async function getBrandByName(name: string): Promise<Brand | null> {
  return (await getBrands()).find((brand) => brand.brand_name === name) ?? null;
}

export async function searchBrands(query: string): Promise<Brand[]> {
  const value = query.toLowerCase();
  return (await getBrands()).filter((brand) => brand.brand_name.toLowerCase().includes(value));
}

export async function createBrand(_data?: Partial<Brand>): Promise<never> {
  throw new Error("Brands are created with their first flat product record");
}

export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null> {
  let changed = false;
  await write((db: any) => {
    for (const product of db.products) {
      const bName = typeof product.brand === "string" ? product.brand : product.brand?.brand_name;
      if (!bName || slugify(bName) !== id) continue;
      if (data.parent_company !== undefined) product.parent_company = data.parent_company;
      if (data.website_url !== undefined) product.website_url = data.website_url;
      product.updated_at = new Date().toISOString();
      changed = true;
    }
  });
  return changed ? getBrandById(id) : null;
}

export async function deleteBrand(_id?: string): Promise<boolean> {
  throw new Error("Delete the brand's product records instead");
}