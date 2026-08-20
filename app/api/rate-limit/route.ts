import { NextRequest, NextResponse } from 'next/server';

// In-memory store: ip -> array of timestamps
const submissionLog = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_SUBMISSIONS = 3; // max 3 submissions per minute per IP

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  const timestamps = (submissionLog.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );

  if (timestamps.length >= MAX_SUBMISSIONS) {
    const oldestAllowed = timestamps[timestamps.length - MAX_SUBMISSIONS];
    const retryAfterMs = WINDOW_MS - (now - oldestAllowed);
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);
    return NextResponse.json(
      { error: `Too many submissions. Please wait ${retryAfterSec} second${retryAfterSec !== 1 ? 's' : ''} before trying again.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  timestamps.push(now);
  submissionLog.set(ip, timestamps);

  return NextResponse.json({ ok: true });
}
