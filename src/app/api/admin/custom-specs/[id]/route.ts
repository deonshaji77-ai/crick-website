import { NextResponse } from 'next/server';
import { updateCustomBatSpec, deleteCustomBatSpec } from '@/lib/firestore';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    await updateCustomBatSpec(params.id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update custom bat spec:', error);
    return NextResponse.json({ error: 'Failed to update custom bat spec' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteCustomBatSpec(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete custom bat spec:', error);
    return NextResponse.json({ error: 'Failed to delete custom bat spec' }, { status: 500 });
  }
}
