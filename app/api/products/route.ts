// ==========================================
// Products API Route
// GET /api/products - List products
// POST /api/products - Create product (authenticated)
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db/products";
import { SearchFilters } from "@/lib/types/db";
import { getProductImages } from "@/lib/db/images";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filters from query params
    const filters: SearchFilters = {};
    
    if (searchParams.has("q")) {
      filters.query = searchParams.get("q")!;
    }
    
    if (searchParams.has("types")) {
      filters.types = searchParams.get("types")!.split(",");
    }
    
    if (searchParams.has("excludeTypes")) {
      filters.excludedTypes = searchParams.get("excludeTypes")!.split(",");
    }
    
    if (searchParams.has("brands")) {
      filters.brands = searchParams.get("brands")!.split(",");
    }
    
    if (searchParams.has("excludeBrands")) {
      filters.excludedBrands = searchParams.get("excludeBrands")!.split(",");
    }
    
    if (searchParams.has("minSweetness")) {
      filters.minSweetness = parseFloat(searchParams.get("minSweetness")!);
    }
    
    if (searchParams.has("maxSweetness")) {
      filters.maxSweetness = parseFloat(searchParams.get("maxSweetness")!);
    }
    
    if (searchParams.has("minRichnessDri")) {
      filters.minRichnessDri = parseFloat(searchParams.get("minRichnessDri")!);
    }
    
    if (searchParams.has("maxRichnessDri")) {
      filters.maxRichnessDri = parseFloat(searchParams.get("maxRichnessDri")!);
    }
    
    // Pagination
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    const result = await getProducts(filters, { limit, offset });
    
    // Fetch images for each product
    const productsWithImages = await Promise.all(
      result.items.map(async (product) => {
        const images = await getProductImages(product.id);
        return {
          ...product,
          images: images.map((img) => ({
            id: img.id,
            filename: img.filename,
            url: `/api/images/${img.id}`,
          })),
        };
      })
    );
    
    return NextResponse.json({
      ...result,
      items: productsWithImages,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields for Kek Lapis records
    if (!body.product_name || typeof body.brand !== "string" || !["traditional", "contemporary", "innovative"].includes(body.type)) {
      return NextResponse.json(
        { error: "product_name, brand, and a valid type are required" },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await createProduct({
      ...body,
      submitted_by: null,
      status: "pending",
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}