import { NextRequest, NextResponse } from 'next/server';
import { contributionSchema } from '@/lib/validations/contribution';

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
  // 1. Rate Limiting Check
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
      { success: false, error: `Too many submissions. Please wait ${retryAfterSec} second${retryAfterSec !== 1 ? 's' : ''} before trying again.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  try {
    const body = await req.json();

    // 2. Zod Schema Validation
    const validationResult = contributionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 3. Record timestamp only after passing validation and rate limit
    timestamps.push(now);
    submissionLog.set(ip, timestamps);

    // TODO: Process or save validData to your database here

    return NextResponse.json({ success: true, data: validData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}