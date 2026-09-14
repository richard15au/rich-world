import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createSignedSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passphrase.' },
        { status: 401 }
      );
    }

    const token = createSignedSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully.' });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error processing authentication.' },
      { status: 500 }
    );
  }
}
