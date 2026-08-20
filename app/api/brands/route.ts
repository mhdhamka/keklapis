// ==========================================
// Brands API Route
// GET /api/brands - List brands
// POST /api/brands - Create brand (authenticated)
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getBrands } from "@/lib/db/brands";

export async function GET(request: NextRequest) {
  try {
    const brands = await getBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "Brands are created with their first product record" },
    { status: 405, headers: { Allow: "GET" } }
  );
}
