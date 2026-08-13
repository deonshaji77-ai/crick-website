import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const knocking = await prisma.knockingTier.findMany({
      include: {
        features: true,
      }
    });
    return NextResponse.json(knocking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch knocking tiers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const features = data.features || [];
    
    const knocking = await prisma.knockingTier.create({
      data: {
        name: data.name,
        price: data.price,
        features: {
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
    return NextResponse.json({ error: 'Failed to create knocking tier' }, { status: 500 });
  }
}
