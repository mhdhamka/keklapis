// ==========================================
// Export Products as CSV API Route
// GET /api/export/products
// ==========================================

import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/products';

export async function GET() {
  try {
    const result = await getProducts(undefined, { limit: 1000, offset: 0 });
    const products = result.items;

    // Define CSV headers for Kek Lapis
    const headers = [
      'ID',
      'Product Name',
      'Brand',
      'Manufacturer',
      'Bakery Origin',
      'Sweetness',
      'Richness DRI',
      'Barcode',
      'Status',
      'Created At',
      'Updated At',
    ];

    // Convert products to CSV rows
    const rows = products.map((product) => [
      product.id,
      product.product_name || '',
      typeof product.brand === 'string' ? product.brand : (product.brand as any)?.brand_name || '',
      product.manufacturer?.name || '',
      product.bakery_origin || '',
      product.sweetness?.toString() || '',
      product.richness_dri?.toString() || '',
      product.barcode || '',
      product.status,
      product.created_at,
      product.updated_at,
    ]);

    // Escape and format CSV cells
    const escapeCsv = (cell: string | null) => {
      const value = cell ?? '';
      // If cell contains comma, quote, or newline, wrap in quotes and escape quotes
      if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCsv).join(',')),
    ].join('\n');

    // Set headers for file download
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="keklapis-products.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    );
  }
}