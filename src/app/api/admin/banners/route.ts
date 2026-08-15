import { NextResponse } from 'next/server';
import { getBannersFromFirestore, addBannerToFirestore } from '@/lib/firestore';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await getBannersFromFirestore();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching admin banners API:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // basic validation
    if (!data.image_url || !data.target_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBanner = {
      image_url: data.image_url,
      target_type: data.target_type,
      target_id: data.target_id || '',
      is_active: data.is_active !== undefined ? data.is_active : true,
      display_order: data.display_order || 0
    };

    const id = await addBannerToFirestore(newBanner);
    
    revalidatePath('/'); // Revalidate storefront homepage
    
    return NextResponse.json({ id, ...newBanner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner API:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
