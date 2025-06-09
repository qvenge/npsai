import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');
  if (!target) return NextResponse.json({ error: 'No url' }, { status: 400 });
  const targetUrl = new URL(target);

  const res = await fetch(targetUrl.toString());
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${targetUrl.pathname.split('/').pop()}"`,
    },
  });
}