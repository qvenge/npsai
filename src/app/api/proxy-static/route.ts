import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');
  if (!target) return NextResponse.json({ error: 'No url' }, { status: 400 });

  const res = await fetch(target);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': 'attachment; filename="image.svg"',
    },
  });
}