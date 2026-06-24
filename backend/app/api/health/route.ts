import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ service: 'mojuri-api', status: 'ok', timestamp: new Date().toISOString() });
}
