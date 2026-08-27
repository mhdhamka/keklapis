import { NextResponse } from "next/server"
import { searchClient } from "@/lib/search/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get("q") || "*"
    const types = searchParams.getAll("type")
    const brands = searchParams.getAll("brand")
    const minSweetness = searchParams.get("min_sweetness")
    const maxSweetness = searchParams.get("max_sweetness")
    const minRichness = searchParams.get("min_richness")
    const maxRichness = searchParams.get("max_richness")
    const tasteVectorStr = searchParams.get("taste_vector")
    const sort = searchParams.get("sort") || "name:asc"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const perPage = parseInt(searchParams.get("per_page") || "12", 10)

    // Build Typesense filter query string
    const filterConditions: string[] = []

    if (types.length > 0) {
      filterConditions.push(`cake_type:=[${types.join(",")}]`)
    }

    if (brands.length > 0) {
      filterConditions.push(`brand_id:=[${brands.join(",")}]`)
    }

    if (minSweetness !== null || maxSweetness !== null) {
      const min = minSweetness !== null ? minSweetness : "0"
      const max = maxSweetness !== null ? maxSweetness : "10"
      filterConditions.push(`sweetness:=[${min}..${max}]`)
    }

    if (minRichness !== null || maxRichness !== null) {
      const min = minRichness !== null ? minRichness : "0"
      const max = maxRichness !== null ? maxRichness : "300"
      filterConditions.push(`richness:=[${min}..${max}]`)
    }

    const filterBy = filterConditions.join(" && ")

    // Handle Vector Search query if taste_vector parameter is passed from HomeFilters
    if (tasteVectorStr) {
      const vectorArray = tasteVectorStr.split(",").map(Number)
      const vectorQuery = `taste_embedding:([${vectorArray.join(",")}], k: 20)`

      const searchResponse = await searchClient
        .collections("lapis_products")
        .documents()
        .search({
          q: query,
          query_by: "name,description,brand_name,cake_type",
          vector_query: vectorQuery,
          filter_by: filterBy || undefined,
          page,
          per_page: perPage,
        })

      return NextResponse.json({
        success: true,
        hits: searchResponse.hits?.map((h: any) => h.document),
        found: searchResponse.found,
        page: searchResponse.page,
      })
    }

    // Standard Faceted Search Request with full filter and sort options
    const searchResponse = await searchClient
      .collections("lapis_products")
      .documents()
      .search({
        q: query,
        query_by: "name,description,brand_name,cake_type",
        filter_by: filterBy || undefined,
        sort_by: sort,
        facet_by: "cake_type,brand_name",
        page,
        per_page: perPage,
      })

    return NextResponse.json({
      success: true,
      hits: searchResponse.hits?.map((h: any) => h.document),
      found: searchResponse.found,
      facets: searchResponse.facet_counts,
      page: searchResponse.page,
    })
  } catch (error) {
    console.error("Discovery API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch discovery results from search engine" },
      { status: 500 }
    )
  }
}