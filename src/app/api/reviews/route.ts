import { NextResponse } from 'next/server';
import { getReviewsFromFirestore, addReviewToFirestore } from '@/lib/firestore';

export async function GET() {
  try {
    const reviews = await getReviewsFromFirestore();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate
    if (!data.name || !data.text || typeof data.rating !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    const reviewData = {
      name: data.name,
      rating: data.rating,
      text: data.text,
      status: 'approved' as const, // For now, defaulting to approved
      createdAt: new Date().toISOString()
    };

    const id = await addReviewToFirestore(reviewData);
    return NextResponse.json({ success: true, review: { id, ...reviewData } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
