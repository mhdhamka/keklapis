// Data store test endpoint
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export async function GET() {
  // Step 1: Load products from the JSON store
  try {
    const result = await getProducts(undefined, { limit: 3, offset: 0 });
    const totalProducts = result.total;

    return NextResponse.json({
      ok: true,
      totalProducts,
      sample: result.items.map((p) => ({
        id: p.id,
        name: p.product_name,
        status: p.status,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      step: "data_load",
      error: e?.message ?? String(e),
    });
  }
}