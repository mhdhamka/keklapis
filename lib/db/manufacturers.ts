import { getAll } from "@/lib/json-store";
import type { Manufacturer } from "@/lib/types/db";
import { slugify } from "./products";

export async function getManufacturers(): Promise<Manufacturer[]> {
  const manufacturers = new Map<string, Manufacturer>();
  for (const product of await getAll("products")) {
    if (!product.manufacturer) continue;
    const id = slugify(product.manufacturer);
    if (!manufacturers.has(id)) manufacturers.set(id, {
      id,
      name: product.manufacturer,
      address: product.manufacturer_address,
      created_at: product.created_at,
      updated_at: product.updated_at,
    });
  }
  return [...manufacturers.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getManufacturerById(id: string): Promise<Manufacturer | null> {
  return (await getManufacturers()).find((manufacturer) => manufacturer.id === id) ?? null;
}

export async function searchManufacturers(query: string): Promise<Manufacturer[]> {
  const value = query.toLowerCase();
  return (await getManufacturers()).filter((manufacturer) => manufacturer.name.toLowerCase().includes(value));
}

export async function createManufacturer(_data?: Partial<Manufacturer>): Promise<never> {
  throw new Error("Manufacturers are stored inside flat product records");
}

export async function updateManufacturer(_id?: string, _data?: Partial<Manufacturer>): Promise<never> {
  throw new Error("Update the containing flat product records instead");
}

export async function deleteManufacturer(_id?: string): Promise<boolean> {
  throw new Error("Delete or update the containing product records instead");
}
