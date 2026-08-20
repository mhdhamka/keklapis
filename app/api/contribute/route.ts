// ==========================================
// Contribute API Route
// POST /api/contribute - Submit a new product entry
// ==========================================

import { NextResponse } from 'next/server';
import { insert, now } from '@/lib/json-store'; 
import type { FlatProductRecord } from '@/lib/types/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation matching expected schema requirements
    if (!body.productName || !body.brand) {
      return NextResponse.json(
        { success: false, error: 'Product name and brand are required.' },
        { status: 400 }
      );
    }

    // Create the new entry record matching FlatProductRecord structure precisely
    const timestamp = await now();
    const newEntry = {
      id: `custom-${Date.now()}`,
      product_name: body.productName,
      brand: body.brand,
      manufacturer: body.manufacturer || null,
      bakery_origin: body.bakeryOrigin || null,
      type: body.type || 'traditional',
      culinary_profile: body.culinaryProfile || 'Traditional Spiced',
      parent_company: body.parentCompany || null,
      sweetness: body.sweetnessLevel !== undefined && body.sweetnessLevel !== '' ? Number(body.sweetnessLevel) : null,
      richness_dri: body.richnessDri !== undefined && body.richnessDri !== '' ? Number(body.richnessDri) : null,
      barcode: body.barcode || '',
      latitude: body.latitude !== undefined ? body.latitude : null,
      longitude: body.longitude !== undefined ? body.longitude : null,
      status: 'pending', // Marked as pending review as specified in your description
      created_at: timestamp,
      updated_at: timestamp,
      // Additional standard properties to satisfy extension requirements
      description: body.description || null,
      ingredients: body.ingredients || null,
      allergens: body.allergens || null,
      halal_certified: body.halalCertified ?? true,
      layers_count: body.layersCount || null,
    } as unknown as FlatProductRecord;

    // Safely insert into the products collection using your store's atomic writer helper
    const insertedRecord = await insert('products', newEntry);

    return NextResponse.json({ success: true, data: insertedRecord });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while saving.' },
      { status: 500 }
    );
  }
}