// ==========================================
// Single Product API Route
// GET /api/products/[id] - Get product by ID
// PATCH /api/products/[id] - Update product (authenticated)
// DELETE /api/products/[id] - Delete product (authenticated)
// ==========================================

import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db/products";
import { getProductImages } from "@/lib/db/images";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Fetch images
    const images = await getProductImages(product.id);
    
    return NextResponse.json({
      ...product,
      images: images.map((img) => ({
        id: img.id,
        filename: img.filename,
        url: `/api/images/${img.id}`,
      })),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const product = await updateProduct(id, body);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const success = await deleteProduct(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
