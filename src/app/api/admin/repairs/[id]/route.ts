import { NextResponse } from 'next/server';
import { deleteRepairServiceFromFirestore } from '@/lib/firestore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Update not fully implemented for Firestore yet' }, { status: 501 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }
    await deleteRepairServiceFromFirestore(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting repair service:', error);
    return NextResponse.json({ error: 'Failed to delete repair service' }, { status: 500 });
  }
}
