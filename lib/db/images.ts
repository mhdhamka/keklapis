import { promises as fs } from "fs";
import path from "path";
import { getAll } from "@/lib/json-store";
import type { Image } from "@/lib/types/db";

const IMAGE_DIR = path.join(process.cwd(), "public", "images", "products");

export async function getImageById(id: string): Promise<Image | null> {
  const product = (await getAll("products")).find((item) => item.id === id);
  if (!product) return null;
  return {
    id: product.id,
    filename: product.image,
    mime_type: "image/webp",
    ext: "webp",
    size_bytes: null,
    created_at: product.created_at,
  };
}

export async function getImageData(id: string): Promise<{ data: Buffer; mimeType: string; filename: string } | null> {
  const image = await getImageById(id);
  if (!image || path.basename(image.filename) !== image.filename) return null;
  try {
    return { data: await fs.readFile(path.join(IMAGE_DIR, image.filename)), mimeType: image.mime_type, filename: image.filename };
  } catch {
    return null;
  }
}

export async function getProductImages(productId: string): Promise<Image[]> {
  const image = await getImageById(productId);
  return image ? [image] : [];
}

export async function getPrimaryProductImage(productId: string): Promise<Image | null> {
  return getImageById(productId);
}
