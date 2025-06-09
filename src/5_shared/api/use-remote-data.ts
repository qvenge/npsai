'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { RequestError } from './request-error';

export type DataTypeName = 'summary' | 'places' | 'chartData' | 'me' | 'reviews';

export const urls: Record<DataTypeName, string> = {
  summary: '/api/review/summary',
  places: '/api/places',
  chartData: '/api/review/chart-data',
  me: '/api/me',
  reviews: 'api/review/list'
};

export interface UseRemoteDataOptionsWithDecoders<R, Chain extends any[]> {
  decoders?: ChainFns<R, Chain>;
  query?: Record<string, any>;
}

export interface UseRemoteDataOptionsWithoutDecoders {
  query?: Record<string, any>;
}

export interface UseRemoteData {
  <R>(
    dataType: DataTypeName,
    opts?: UseRemoteDataOptionsWithoutDecoders
  ): UseQueryResult<R>;
  <R, Chain extends any[]>(
    dataType: DataTypeName,
    opts?: UseRemoteDataOptionsWithDecoders<R, Chain>
  ): UseQueryResult<Chain extends [...any[], infer Last] ? Last : R>;
}

export const useRemoteData: UseRemoteData = <R = any, Chain extends any[] = []>(
  dataType: DataTypeName,
  opts: UseRemoteDataOptionsWithDecoders<R, Chain> = {}
) => {
  return useQuery({
    queryKey: [dataType, opts.query],
    queryFn: async () => {
      const data = await fetchRemoteData<R>(dataType, opts.query);
      return Array.isArray(opts?.decoders) ? opts.decoders.reduce((acc, decoder) => decoder(acc), data) : data;
    }
  });
}

export async function fetchRemoteData<R>(dataType: DataTypeName, query: Record<string, any> = {}): Promise<R> {
  const searchParams = new URLSearchParams(query);
  const res = await fetch(`${urls[dataType]}${searchParams.size ? `?${searchParams.toString()}` : ''}`);

  if (!res.ok) {
    throw new RequestError(res);
  }

  return res.json() as R;
}