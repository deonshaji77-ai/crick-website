import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, postUrl, mediaType = 'image' } = body;

    if (!imageUrl || !postUrl) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newPost = await prisma.instagramPost.create({
      data: {
        imageUrl,
        postUrl,
        mediaType,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating Instagram post:', error);
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}
