'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type useAPIQueryResult<T> = [T, (state: Partial<T>) => void];

export function useSpecificQuery<T extends Record<string, string>>(
  queryKeys: Array<keyof T>
): useAPIQueryResult<T> {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const params = Object.fromEntries(queryKeys
    .filter((key) => searchParams.has(String(key)))
    .map((key) => [key, searchParams.get(String(key))] as const)
  );
  const queryStr = JSON.stringify(params);
  const query = useMemo(() => params, [queryStr]);

  const setQuery = useCallback((newQuery: Partial<T>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newQuery).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    replace(`?${current.toString()}`)
  }, [searchParams, replace]);

  return [query as T, setQuery]
}
