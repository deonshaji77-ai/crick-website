import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    
    const repair = await prisma.repairService.update({
      where: { id: params.id },
      data: {
        name: data.name,
        turnaroundTime: data.turnaroundTime,
        basePrice: data.basePrice,
        imageReference: data.imageReference,
      }
    });
    
    return NextResponse.json(repair);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update repair service' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.repairService.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete repair service' }, { status: 500 });
  }
}
