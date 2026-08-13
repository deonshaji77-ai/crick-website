import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const repairs = await prisma.repairService.findMany();
    return NextResponse.json(repairs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch repair services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const repair = await prisma.repairService.create({
      data: {
        name: data.name,
        turnaroundTime: data.turnaroundTime,
        basePrice: data.basePrice,
        imageReference: data.imageReference,
      }
    });
    
    return NextResponse.json(repair);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create repair service' }, { status: 500 });
  }
}
