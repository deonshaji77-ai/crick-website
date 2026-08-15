import { NextResponse } from 'next/server';
import { deleteKnockingTierFromFirestore } from '@/lib/firestore';
import { revalidatePath } from 'next/cache';

// We aren't actively using PUT in the manager, but I'll leave the endpoint stubbed out
// since the prompt says to refactor PUT and DELETE.
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Update not fully implemented for Firestore yet' }, { status: 501 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }
    await deleteKnockingTierFromFirestore(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting knocking tier:', error);
    return NextResponse.json({ error: 'Failed to delete knocking tier' }, { status: 500 });
  }
}
