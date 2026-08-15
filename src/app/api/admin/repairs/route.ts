import { NextResponse } from 'next/server';
import { getRepairServicesFromFirestore, addRepairServiceToFirestore } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repairs = await getRepairServicesFromFirestore();
    return NextResponse.json(repairs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch repair services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const newRepair = {
      name: data.name,
      turnaroundTime: data.turnaroundTime,
      basePrice: data.basePrice,
      imageReference: data.imageReference || null,
    };
    
    const id = await addRepairServiceToFirestore(newRepair);
    
    return NextResponse.json({ id, ...newRepair });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create repair service' }, { status: 500 });
  }
}
