import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory status tracking (in production, use Redis or database)
let lastSyncTime: Date | null = null;
let isRunning = false;
let lastSyncResult: any = null;

export async function GET() {
  return NextResponse.json({
    isRunning,
    lastSyncTime: lastSyncTime?.toISOString() || null,
    lastSyncResult,
    nextScheduledSync: getNextSyncTime()
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'trigger') {
      // Trigger manual sync
      if (isRunning) {
        return NextResponse.json(
          { error: 'Sync already running' },
          { status: 409 }
        );
      }

      // Run sync in background
      runManualSync();

      return NextResponse.json({
        message: 'Manual sync triggered',
        status: 'running'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function runManualSync() {
  isRunning = true;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3100'}/api/admin/catalog-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    lastSyncResult = {
      success: response.ok,
      data: result,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    lastSyncResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  } finally {
    isRunning = false;
    lastSyncTime = new Date();
  }
}

function getNextSyncTime(): string {
  const now = new Date();
  const nextRun = new Date(now);

  // Calculate next 2-hour interval
  const currentHour = now.getHours();
  const nextHour = Math.ceil((currentHour + 1) / 2) * 2;
  nextRun.setHours(nextHour % 24, 0, 0, 0);

  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.toISOString();
}