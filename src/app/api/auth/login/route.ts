import { NextResponse } from 'next/server';
import { verifyPassword, createSessionToken, COOKIE_NAME, TOKEN_EXPIRY_MS } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    // Generate signed HMAC token
    const token = await createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(TOKEN_EXPIRY_MS / 1000),
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
