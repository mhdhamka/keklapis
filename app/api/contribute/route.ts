// ==========================================
// Contribute API Route
// POST /api/contribute - Submit a new product entry
// ==========================================

import { NextResponse } from 'next/server';
import { insert, now } from '@/lib/json-store'; 
import { contributionSchema } from '@/lib/validations/contribution';
import type { FlatProductRecord } from '@/lib/types/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side validation with Zod
    const validationResult = contributionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Create the new entry record matching FlatProductRecord structure precisely using validated data
    const timestamp = await now();
    const newEntry = {
      id: `custom-${Date.now()}`,
      product_name: validData.productName,
      brand: validData.brand,
      manufacturer: validData.manufacturer || null,
      bakery_origin: validData.bakeryOrigin || null,
      type: (body.type as string) || 'traditional',
      culinary_profile: (body.culinaryProfile as string) || 'Traditional Spiced',
      parent_company: (body.parentCompany as string) || null,
      sweetness: validData.sweetnessLevel !== undefined && validData.sweetnessLevel !== null ? Number(validData.sweetnessLevel) : null,
      richness_dri: validData.richnessDri !== undefined && validData.richnessDri !== null ? Number(validData.richnessDri) : null,
      barcode: validData.barcode || '',
      latitude: validData.latitude !== undefined ? validData.latitude : null,
      longitude: validData.longitude !== undefined ? validData.longitude : null,
      status: 'pending',
      created_at: timestamp,
      updated_at: timestamp,
      description: (body.description as string) || null,
      ingredients: (body.ingredients as string) || null,
      allergens: (body.allergens as string) || null,
      halal_certified: body.halalCertified ?? true,
      layers_count: (body.layersCount as string) || null,
    } as unknown as FlatProductRecord;

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