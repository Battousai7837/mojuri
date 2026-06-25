import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const requestOrigin = request.headers.get('origin');
  const configuredOrigin = process.env.FRONTEND_URL ?? 'http://localhost:5173';
  const origin = requestOrigin && (
    requestOrigin === configuredOrigin ||
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+):5173$/.test(requestOrigin)
  ) ? requestOrigin : configuredOrigin;
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Allow-Credentials', 'true');
  if (request.method === 'OPTIONS') return new NextResponse(null, { status: 204, headers });
  const response = NextResponse.next();
  headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = { matcher: '/api/:path*' };
