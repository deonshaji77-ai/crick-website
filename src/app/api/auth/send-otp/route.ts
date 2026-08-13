import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it in memory for 10 minutes
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // -------------------------------------------------------------
    // IMPORTANT: In production, integrate SendGrid or Resend here.
    // e.g., await resend.emails.send({ to: email, subject: 'Admin OTP', text: `Your OTP is ${otp}` });
    // -------------------------------------------------------------
    
    // MOCK EMAIL DISPATCH: Print to server console
    console.log('\n=========================================');
    console.log(`🔐 ADMIN LOGIN OTP FOR ${email}: ${otp}`);
    console.log('=========================================\n');

    return NextResponse.json({ success: true, message: 'OTP sent successfully (Check server console)' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
