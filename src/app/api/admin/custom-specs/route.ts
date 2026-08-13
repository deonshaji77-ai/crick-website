import { NextResponse } from 'next/server';
import { getCustomBatSpecs, addCustomBatSpec } from '@/lib/firestore';

export async function GET() {
  try {
    const specs = await getCustomBatSpecs();
    return NextResponse.json(specs);
  } catch (error) {
    console.error('Failed to get custom bat specs:', error);
    return NextResponse.json({ error: 'Failed to get custom bat specs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newSpec = {
      ...data,
      createdAt: new Date().toISOString()
    };
    const id = await addCustomBatSpec(newSpec);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to create custom bat spec:', error);
    return NextResponse.json({ error: 'Failed to create custom bat spec' }, { status: 500 });
  }
}
