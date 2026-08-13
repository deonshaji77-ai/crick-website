import { NextResponse } from 'next/server';
import { deleteReviewFromFirestore } from '@/lib/firestore';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    await deleteReviewFromFirestore(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
