import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const id = params.id;
    
    // Check if specifications are provided
    const specifications = data.specifications || [];
    
    // Prisma requires deleting old specs and creating new ones for a full replacement
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        basePrice: data.basePrice,
        category: data.category,
        image: data.image,
        specifications: {
          deleteMany: {},
          create: specifications.map((spec: any) => ({
            key: spec.key,
            value: spec.value,
          }))
        }
      },
      include: {
        specifications: true
      }
    });
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
