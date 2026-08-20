import { NextResponse } from "next/server";
import { getAll } from "@/lib/json-store";

export async function GET() {
  try {
    const products = (await getAll("products")).filter((product) => product.status === "approved");
    return new NextResponse(JSON.stringify({
      metadata: {
        exported_at: new Date().toISOString(),
        total: products.length,
        schema_version: 2,
        source: "CariAir - Malaysia Mineral & Drinking Water Source Registry",
        url: "https://cariair.my",
      },
      products,
    }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cariair-products.json"',
      },
    });
  } catch (error) {
    console.error("Error exporting JSON:", error);
    return NextResponse.json({ error: "Failed to export products" }, { status: 500 });
  }
}
