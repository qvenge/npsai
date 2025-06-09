import { requestApi } from './request';
import { Place } from './places';

export interface User {
  id: string;
  email: string;
  info: {
    name: string;
    addres: string;
    INN: string;
    KPP: string;
    OGRN: string;
  },
  places: Place[];
}

export async function getUser(accessToken: string): Promise<User> {
  try {
    const res = await requestApi(`/me`, { accessToken });

    if (res.status !== 200) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    if (data?.result == null) {
      console.log('Failed to fetch user.', res.status, res.statusText, data);
      throw new Error('Failed to fetch user.');
    }

    return data.result;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
