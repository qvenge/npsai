'use server';

import { requestApi } from '@/shared/api';
import { auth } from '@/auth'

export async function setUserRatingAction(id: number, rating: string) {
  const session = await auth();

  const res = await requestApi(`/review/set_user_rating?review_id=${id}&user_rating=${rating}`, {
    method: 'PUT',
    accessToken: session?.access_token
  });

  return res.ok;
}