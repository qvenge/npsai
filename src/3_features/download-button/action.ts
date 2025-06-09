'use server';

import { requestApi } from '@/shared/api';
import { auth } from '@/auth';
export async function prepareDownloadAction(place_id: string) {
  const session = await auth();

  const res = await requestApi(`/review/prepare_upload?place_id=${place_id}`, {
    method: 'POST',
    accessToken: session?.access_token
  });

  if (res.status < 200 || res.status >= 300) {
    return {
      error: {
        status: res.status,
        statusText: res.statusText
      }
    }
  }

  return res.json();
}