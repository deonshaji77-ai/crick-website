import { NextResponse } from 'next/server';
import { deleteBannerFromFirestore } from '@/lib/firestore';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing banner ID' }, { status: 400 });
    }

    await deleteBannerFromFirestore(id);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting banner API:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
