import { redirect } from 'next/navigation';
import { getPlaces } from '@/shared/api';

export interface RedirectGuardProps {
  pathname: string
  searchParams?: Record<string, string>
}

export async function RedirectGuard({ pathname, searchParams = {} }: RedirectGuardProps) {
  const places = await getPlaces();
  const place_id = places.find(place => place.id === searchParams.place_id);

  if (places.length > 0 && place_id == null) {
    const params = new URLSearchParams({ ...searchParams, place_id: places[0].id });
    redirect(`${pathname}?${params.toString()}`)
  }

  return null
}