'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type Period = 'week' | 'month' | 'year' | 'all' | 'custom';

export interface BaseReviewQuery {
  place_id?: string | null;
  period?: Period | null;
  period_from?: string | null;
  period_to?: string | null;
}

const queryKeys: (keyof BaseReviewQuery)[] = ['place_id', 'period', 'period_from', 'period_to'];

export function useReviewQuery(): [BaseReviewQuery, (state: BaseReviewQuery) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = useMemo(() => Object.fromEntries(queryKeys
    .filter((key) => searchParams.has(key))
    .map((key) => [key, searchParams.get(key)] as const)
  ), [searchParams]);

  const setQuery = useCallback((newQuery: BaseReviewQuery) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    router.replace(`?${current.toString()}`)
  }, [searchParams, router]);

  return [query, setQuery]
}
