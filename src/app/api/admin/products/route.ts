import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check if specifications are provided
    const specifications = data.specifications || [];
    
    const product = await prisma.product.create({
      data: {
        name: data.name,
        basePrice: data.basePrice,
        category: data.category,
        image: data.image,
        specifications: {
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
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
