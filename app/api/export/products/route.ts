// Export products as CSV
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/products';

export async function GET() {
  try {
    const result = await getProducts(undefined, { limit: 1000, offset: 0 });
    const products = result.items;

    // Define CSV headers
    const headers = [
      'ID',
      'Product Name',
      'Brand',
      'Manufacturer',
      'Source',
      'Source Type',
      'Barcode',
      'pH Level',
      'TDS (mg/L)',
      'Country',
      'Status',
      'Created At',
      'Updated At',
    ];

    // Convert products to CSV rows
    const rows = products.map((product) => [
      product.id,
      product.product_name || '',
      product.brand?.brand_name || '',
      product.manufacturer?.name || '',
      product.source?.source_name || '',
      product.source?.type || '',
      product.barcode || '',
      product.ph_level?.toString() || '',
      product.tds?.toString() || '',
      product.source?.country || '',
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
        'Content-Disposition': 'attachment; filename="cariair-products.csv"',
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
