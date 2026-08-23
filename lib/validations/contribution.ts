import { z } from "zod"

export const contributionSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters long"),
  brand: z.string().min(1, "Bakery or brand is required"),
  manufacturer: z.string().optional(),
  bakeryOrigin: z.string().optional(),
  sweetnessLevel: z.coerce.number().min(0).max(10).optional(),
  richnessDri: z.coerce.number().min(0).optional(),
  barcode: z.string().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

export type ContributionFormData = z.infer<typeof contributionSchema>