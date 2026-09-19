import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const FALLBACK_FILE = path.join(process.cwd(), '.visit_metrics.json');

function getFallbackVisits(): number {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
      return typeof data.visits === 'number' ? data.visits : 1240;
    }
  } catch {
    // ignore
  }
  return 1240;
}

function setFallbackVisits(count: number): void {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify({ visits: count, updatedAt: new Date().toISOString() }), 'utf8');
  } catch {
    // ignore
  }
}

async function getOrInitDbVisits(increment = false): Promise<number> {
  try {
    // Ensure table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS site_metrics (
        key TEXT PRIMARY KEY,
        value BIGINT NOT NULL DEFAULT 1240,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    if (increment) {
      const rows = (await prisma.$queryRawUnsafe(`
        INSERT INTO site_metrics (key, value) VALUES ('total_visits', 1241)
        ON CONFLICT (key) DO UPDATE SET value = site_metrics.value + 1, updated_at = CURRENT_TIMESTAMP
        RETURNING value;
      `)) as Array<{ value: bigint | number | string }>;

      if (rows && rows.length > 0) {
        const count = Number(rows[0].value);
        setFallbackVisits(count);
        return count;
      }
    } else {
      const rows = (await prisma.$queryRawUnsafe(`
        SELECT value FROM site_metrics WHERE key = 'total_visits' LIMIT 1;
      `)) as Array<{ value: bigint | number | string }>;

      if (rows && rows.length > 0) {
        return Number(rows[0].value);
      }
    }
  } catch (err) {
    console.error('Database metrics query error, using fallback:', err);
  }

  // Fallback to local storage if database call has issues
  let count = getFallbackVisits();
  if (increment) {
    count += 1;
    setFallbackVisits(count);
  }
  return count;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAdmin = verifySessionToken(token);
  const visits = await getOrInitDbVisits(false);

  return NextResponse.json({ visits, isAdmin });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAdmin = verifySessionToken(token);

  // Check if this browser has already been counted this session
  const sessionCounted = req.cookies.get('rw_session_counted')?.value;
  const shouldIncrement = !sessionCounted;

  const visits = await getOrInitDbVisits(shouldIncrement);

  const res = NextResponse.json({ visits, isAdmin });

  if (shouldIncrement) {
    res.cookies.set({
      name: 'rw_session_counted',
      value: '1',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return res;
}
