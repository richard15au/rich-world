import crypto from 'crypto';

const COOKIE_NAME = 'portfolio_admin_session';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-insecure-secret-key-replace-in-prod';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export { COOKIE_NAME };

export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  // Use timingSafeEqual to mitigate timing attacks
  const inputBuffer = Buffer.from(input);
  const targetBuffer = Buffer.from(ADMIN_PASSWORD);
  if (inputBuffer.length !== targetBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(inputBuffer, targetBuffer);
}

export function createSignedSessionToken(): string {
  const payload = `owner_session_${Date.now()}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const hmac = crypto.createHmac('sha256', ADMIN_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}
