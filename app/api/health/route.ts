// ==========================================
// Health Check API Route
// GET /api/health - Check data store + return basic stats
// ==========================================

import { NextResponse } from "next/server";
import { getAll } from "@/lib/json-store";
import { getBrands } from "@/lib/db/brands";
import { getSources } from "@/lib/db/registry";

export async function GET() {
  try {
    const [brands, sources, products] = await Promise.all([
      getBrands(),
      getSources(),
      getAll("products"),
    ]);

    return NextResponse.json({
      status: "healthy",
      database: "json",
      stats: {
        brands: brands.length,
        sources: sources.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 500 }
    );
  }
}
