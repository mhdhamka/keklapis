import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Product IDs and image basenames are the same stable slug.
export function getImageUrl(
  imageId: string | { id?: string } | undefined,
  image?: { id?: string } | undefined
): string {
  // Handle undefined/null
  if (!imageId) {
    return '/placeholder.svg';
  }

  // If first arg is a string, it's the image ID
  if (typeof imageId === 'string') {
    const filename = imageId.endsWith('.webp') ? imageId : `${imageId}.webp`;
    return `/images/products/${filename}`;
  }

  // Handle object form - extract id from various possible locations
  // This handles: getImageUrl(product, imageObject) or getImageUrl(imageObject)
  const id = image?.id || imageId?.id;

  if (id) {
    return `/images/products/${id}.webp`;
  }

  return '/placeholder.svg';
}
