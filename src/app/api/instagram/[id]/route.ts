import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing post ID' }, { status: 400 });
    }

    await prisma.instagramPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Instagram post:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
