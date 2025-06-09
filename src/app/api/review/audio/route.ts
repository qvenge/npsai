import { NextRequest } from 'next/server';
import { requestApi } from '@/shared/api';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get('file');
  
  if (!fileUrl) {
    return new Response('Missing file parameter', { status: 400 });
  }

  const range = request.headers.get('range');

  // Достаём токен из куки (если у тебя NextAuth, можно и через headers/cookies)
  // const accessToken = request.cookies.get('access_token')?.value;
  const session = await auth();
  const accessToken = session?.access_token;

  const headers: Record<string, string> = {
    cookie: `users_access_token=${accessToken}; Path=/; HttpOnly;`
  }

  if (range) headers['Range'] = range;

  // Проксируем запрос на защищённый сервер
  const backendRes = await fetch(`http://194.226.121.220:8020/uploads/${fileUrl}`, {
    headers
  });

  const proxyHeaders: Record<string, string> = {};

  [
    'Content-Type',
    'Content-Length',
    'Content-Range',
    'Accept-Ranges',
    'Content-Disposition',
  ].forEach((key) => {
    const v = backendRes.headers.get(key);
    if (v) proxyHeaders[key] = v;
  });

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: proxyHeaders,
  });
}