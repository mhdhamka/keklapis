import { getBrands } from "@/lib/db/brands"
import { getSources } from "@/lib/db/registry"
import { getProducts } from "@/lib/db/products"
import { isViewMode, type ViewMode } from "@/lib/view"
import HomeClient from "./home-client"

export const dynamic = "force-dynamic"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function HomePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  const query = (searchParams.q as string) || ""
  const sort = (searchParams.sort as string) || "name_asc"
  const types = searchParams.type
    ? Array.isArray(searchParams.type) ? searchParams.type : [searchParams.type]
    : []
  const brandIds = searchParams.brand
    ? Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand]
    : []
  
  // Refactored from pH/TDS to culinary metrics (e.g., sweetness & richness/moisture indices)
  const minSweetness = searchParams.min_sweetness ? Number(searchParams.min_sweetness) : undefined
  const maxSweetness = searchParams.max_sweetness ? Number(searchParams.max_sweetness) : undefined
  const minRichness = searchParams.min_richness ? Number(searchParams.min_richness) : undefined
  const maxRichness = searchParams.max_richness ? Number(searchParams.max_richness) : undefined
  
  const view: ViewMode = isViewMode(searchParams.view) ? searchParams.view : "cards"

  const [productsResult, brands, allSources, allProductsResult] = await Promise.all([
    getProducts({ 
      query, 
      types, 
      brands: brandIds, 
      minSweetness, 
      maxSweetness, 
      minRichness, 
      maxRichness 
    }),
    getBrands(),
    getSources(),
    getProducts(undefined, { limit: 1, offset: 0 }),
  ])

  return (
    <HomeClient
      initialProducts={productsResult.items}
      brands={brands}
      allSources={allSources}
      totalProductsCount={allProductsResult.total}
      query={query}
      sort={sort}
      types={types}
      brandIds={brandIds}
      minSweetness={minSweetness}
      maxSweetness={maxSweetness}
      minRichness={minRichness}
      maxRichness={maxRichness}
      view={view}
    />
  )
}