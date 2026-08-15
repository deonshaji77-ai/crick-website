import { NextResponse } from 'next/server';
import { getPublicBannersFromFirestore } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await getPublicBannersFromFirestore();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching public banners API:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
