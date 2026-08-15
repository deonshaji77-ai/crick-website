import { NextResponse } from 'next/server';
import { getKnockingTiersFromFirestore, addKnockingTierToFirestore } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const knocking = await getKnockingTiersFromFirestore();
    return NextResponse.json(knocking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch knocking tiers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const featuresStrings = data.features || [];
    
    // Convert feature strings into { id, description }
    const features = featuresStrings.map((feature: string, index: number) => ({
      id: `feature-${Date.now()}-${index}`,
      description: feature
    }));
    
    const newTier = {
      name: data.name,
      price: parseFloat(data.price),
      features: features
    };
    
    const id = await addKnockingTierToFirestore(newTier);
    
    return NextResponse.json({ id, ...newTier });
  } catch (error) {
    console.error('Error creating knocking tier:', error);
    return NextResponse.json({ error: 'Failed to create knocking tier' }, { status: 500 });
  }
}
