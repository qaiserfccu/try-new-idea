import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/logger';

export async function GET() {
  try {
    const logs = getLogs();
    return NextResponse.json({ logs });
  } catch (err) {
    console.error('Failed to fetch logs', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
