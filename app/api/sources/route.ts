// ==========================================
// Sources API Route
// GET /api/sources - List sources
// POST /api/sources - Create source (authenticated)
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getSources, getSourcesWithCoordinates } from "@/lib/db/sources";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if map data is requested
    const forMap = searchParams.get("map") === "true";
    
    let sources;
    if (forMap) {
      sources = await getSourcesWithCoordinates();
    } else {
      sources = await getSources();
    }
    
    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "Sources are stored inside product records" },
    { status: 405, headers: { Allow: "GET" } }
  );
}
