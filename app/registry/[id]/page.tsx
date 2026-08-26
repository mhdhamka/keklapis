import { notFound } from "next/navigation"
import { getProductById } from "@/lib/db/products"
import type { Product } from "@/lib/types/db"
import { RegistryPageClient } from "@/components/registry-page-client"

export const dynamic = "force-dynamic"

export default async function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let product: Product | null = null
  
  try { 
    product = await getProductById(id) 
  } catch (error) { 
    console.error("[sources/[id]] Error fetching product:", id, error) 
  }

  if (!product) notFound()

  return <RegistryPageClient product={product} />
}