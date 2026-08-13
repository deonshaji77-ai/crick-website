import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const record = otpStore.get(email);

    if (!record) {
      return NextResponse.json({ error: 'OTP not found or expired. Please request a new one.' }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Success! Clear the OTP so it can't be reused
    otpStore.delete(email);
    
    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
