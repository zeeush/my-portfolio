import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecretKey(): string {
  return process.env.ADMIN_AUTH_SECRET || process.env.ADMIN_PASSWORD || 'default_admin_dev_secret_key_change_me';
}

function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

export function verifyPassword(password: string): boolean {
  const expected = getExpectedPassword();
  if (!password || !expected) return false;
  return password.trim() === expected.trim();
}

/**
 * Generate HMAC-SHA256 signature for a payload
 */
async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Create a signed session token: Base64(payload).signature
 */
export async function createSessionToken(): Promise<string> {
  const payloadObj = {
    role: 'admin',
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };
  const payloadStr = JSON.stringify(payloadObj);
  const payloadBase64 = Buffer.from(payloadStr).toString('base64url');
  const signature = await signPayload(payloadBase64, getSecretKey());
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify a signed session token
 */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    if (!token || !token.includes('.')) return false;
    const [payloadBase64, providedSignature] = token.split('.');
    if (!payloadBase64 || !providedSignature) return false;

    const expectedSignature = await signPayload(payloadBase64, getSecretKey());
    if (expectedSignature !== providedSignature) return false;

    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as { role?: string; exp?: number };

    if (!payload || payload.role !== 'admin' || !payload.exp) return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch (err) {
    console.error('Session verification error:', err);
    return false;
  }
}

/**
 * Authenticate incoming request via cookie or Authorization header
 */
export async function isAuthenticated(request?: Request): Promise<boolean> {
  try {
    // 1. Check Authorization Bearer header if passed
    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (await verifySessionToken(token)) return true;
      }
    }

    // 2. Check Next.js HTTP-only cookie store
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token && (await verifySessionToken(token))) {
      return true;
    }

    return false;
  } catch (err) {
    console.error('Auth check error:', err);
    return false;
  }
}

export { COOKIE_NAME, TOKEN_EXPIRY_MS };
