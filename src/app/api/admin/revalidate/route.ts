import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tags, paths } = body;

    if (tags && Array.isArray(tags)) {
      tags.forEach(tag => revalidateTag(tag));
    }

    if (paths && Array.isArray(paths)) {
      paths.forEach(path => revalidatePath(path));
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
