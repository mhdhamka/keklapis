import { NextResponse } from 'next/server';
import { insert, now } from '@/lib/json-store'; 

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

    // Create the new entry record matching FlatProductRecord structure
    const timestamp = await now();
    const newEntry = {
      id: `custom-${Date.now()}`,
      productName: body.productName,
      brand: body.brand,
      manufacturer: body.manufacturer || null,
      bakeryOrigin: body.bakeryOrigin || null,
      sweetnessLevel: body.sweetnessLevel !== undefined && body.sweetnessLevel !== '' ? Number(body.sweetnessLevel) : null,
      richnessDri: body.richnessDri !== undefined && body.richnessDri !== '' ? Number(body.richnessDri) : null,
      barcode: body.barcode || '',
      latitude: body.latitude !== undefined ? body.latitude : null,
      longitude: body.longitude !== undefined ? body.longitude : null,
      status: 'pending', // Marked as pending review as specified in your description
      createdAt: timestamp,
    };

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