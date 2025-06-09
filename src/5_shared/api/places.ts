import { requestApi } from './request';
import { auth } from '@/auth';


export interface Place {
  id: string;
  name: string;
  ptype: string;
  notification_enable: boolean;
  notification_recipient: string;
  image_url: string;
  qr_url: string;
}

export async function getPlaces(): Promise<Place[]> {
  const session = await auth();

  const res = await requestApi('/review/places', {accessToken: session?.access_token});

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  return data.result as Place[];
}