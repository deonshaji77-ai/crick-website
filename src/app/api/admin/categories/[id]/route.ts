import { NextResponse } from 'next/server';
import { updateCategoryInFirestore, deleteCategoryFromFirestore } from '@/lib/firestore';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    await updateCategoryInFirestore(params.id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCategoryFromFirestore(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
