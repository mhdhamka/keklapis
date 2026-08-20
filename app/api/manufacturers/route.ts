// ==========================================
// Manufacturers API Route
// GET /api/manufacturers - List manufacturers
// POST /api/manufacturers - Create manufacturer (authenticated)
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getManufacturers } from "@/lib/db/manufacturers";

export async function GET(request: NextRequest) {
  try {
    const manufacturers = await getManufacturers();
    return NextResponse.json({ manufacturers });
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "Manufacturers are stored inside product records" },
    { status: 405, headers: { Allow: "GET" } }
  );
}
