import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
  const authenticated = await isAuthenticated(request);
  return NextResponse.json({ authenticated });
}
