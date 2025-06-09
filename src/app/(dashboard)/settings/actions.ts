'use server';

import { redirect } from 'next/navigation';
import { requestApi } from '@/shared/api';
import { signOut, auth } from '@/auth';

export async function logoutAction() {
  const session = await auth();

  // 1. Выход на внешнем API (замени URL на свой)
  await requestApi('/logout', {
    method: 'POST',
    credentials: 'include', // чтобы ушли куки если надо
    accessToken: session?.access_token
  });

  // 2. Локальный выход из NextAuth
  await signOut({redirect: false}); // или redirect: false, если контролируешь редирект вручную
  redirect('/login');
}