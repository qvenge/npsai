import { NextRequest } from 'next/server';
import { requestApi } from '@/shared/api';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.access_token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Подключаемся к внешнему SSE endpoint с авторизацией
  const resp = await requestApi('/task_status', {
    accessToken: session.access_token
  });

  if (!resp.body) {
    return new Response('No stream', { status: 502 });
  }

  // Проксируем поток клиенту
  return new Response(resp.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // 'Transfer-Encoding': 'chunked', // не нужен в fetch/Response
    },
  });
}
