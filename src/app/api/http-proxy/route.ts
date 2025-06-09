import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {

  const url = new URL(request.nextUrl.searchParams.get('url') || '');
  if (url.protocol !== 'http:') return NextResponse.json({ error: 'Only http allowed' }, { status: 400 });

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  console.log('Content-Type', response.headers.get('content-type'));

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Content-length': response.headers.get('content-length') || '0',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}