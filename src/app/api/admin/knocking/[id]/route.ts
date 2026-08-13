import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const id = params.id;
    const features = data.features || [];
    
    const knocking = await prisma.knockingTier.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        features: {
          deleteMany: {},
          create: features.map((feature: string) => ({
            description: feature,
          }))
        }
      },
      include: {
        features: true
      }
    });
    
    return NextResponse.json(knocking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update knocking tier' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.knockingTier.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete knocking tier' }, { status: 500 });
  }
}
