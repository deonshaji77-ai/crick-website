import { NextResponse } from 'next/server';
import { getCategoriesFromFirestore, getProductsFromFirestore } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      getCategoriesFromFirestore(),
      getProductsFromFirestore()
    ]);

    const mappedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      type: 'category'
    }));

    const mappedProducts = products.map((prod: any) => ({
      id: prod.id,
      name: prod.name,
      type: 'product'
    }));

    return NextResponse.json({
      categories: mappedCategories,
      products: mappedProducts
    });
  } catch (error) {
    console.error('Error fetching linkable items:', error);
    return NextResponse.json({ error: 'Failed to fetch linkable items' }, { status: 500 });
  }
}
