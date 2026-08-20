// ==========================================
// Image Serving API Route
// GET /api/images/[id] - Serve image from public/images/db/<id>.<ext>
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getImageData } from "@/lib/db/images";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const imageData = await getImageData(id);
    
    if (!imageData) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }
    
    // Return image with appropriate headers
    const imageBuffer = Buffer.from(imageData.data);
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": imageData.mimeType,
        "Content-Length": String(imageBuffer.length),
        "Content-Disposition": `inline; filename="${imageData.filename}"`,
        "Cache-Control": "public, max-age=86400, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image" },
      { status: 500 }
    );
  }
}
