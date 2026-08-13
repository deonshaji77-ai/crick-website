import { NextResponse } from 'next/server';
import { getCategoriesFromFirestore, addCategoryToFirestore } from '@/lib/firestore';

export async function GET() {
  try {
    const categories = await getCategoriesFromFirestore();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const id = await addCategoryToFirestore({
      ...data,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id, ...data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
