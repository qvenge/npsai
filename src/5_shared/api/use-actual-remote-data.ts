'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useSpecificQuery } from './use-specific-query';
import { RequestError } from './request-error';
import { type DataTypeName } from './use-remote-data';

interface DataType {
  url: string;
  searchParamKeys?: string[];
  requiredParams?: string[];
}

const dataTypes: Record<DataTypeName, DataType> = {
  summary: {
    requiredParams: ['place_id'],
    url: '/api/review/summary',
    searchParamKeys: ['place_id', 'period_from', 'period_to']
  },
  places: {
    url: '/api/places',
  },
  chartData: {
    requiredParams: ['place_id'],
    url: '/api/review/chart-data',
    searchParamKeys: ['place_id', 'period_from', 'period_to']
  },
  me: {
    url: '/api/me',
  },
  reviews: {
    url: 'api/review/list',
    requiredParams: ['place_id'],
    searchParamKeys: [
      'place_id',
      'period_from',
      'period_to',
      'filter',
      'page',
      'order_by',
      'descending',
      'size'
    ]
  },
};


export interface UseActualRemoteDataOptionsWithDecoders<R, Chain extends any[]> {
  decoders?: ChainFns<R, Chain>;
  query?: Record<string, any>;
}

export interface UseActualRemoteDataOptionsWithoutDecoders {
  query?: Record<string, any>;
}

export interface UseActualRemoteData {
  <R>(
    dataType: DataTypeName,
    opts?: UseActualRemoteDataOptionsWithoutDecoders
  ): UseQueryResult<R>;
  <R, Chain extends any[]>(
    dataType: DataTypeName,
    opts?: UseActualRemoteDataOptionsWithDecoders<R, Chain>
  ): UseQueryResult<Chain extends [...any[], infer Last] ? Last : R>;
}

export const useActualRemoteData: UseActualRemoteData = <R = any, Chain extends any[] = []>(
  typeName: DataTypeName,
  opts: UseActualRemoteDataOptionsWithDecoders<R, Chain> = {}
) => {
  const dataType = dataTypes[typeName];
  const [query] = useSpecificQuery(dataType.searchParamKeys ?? []);

  const params = {
    ...query,
    ...opts.query
  };

  return useQuery({
    queryKey: [dataType, params],
    queryFn: async () => {
      if (dataType.requiredParams) {
        for (const paramKey of dataType.requiredParams) {
          if (!params[paramKey]) {
            return null;
          }
        }
      }

      const searchParams = new URLSearchParams(params);
      const res = await fetch(`${dataType.url}${searchParams.size ? `?${searchParams.toString()}` : ''}`);

      if (!res.ok) {
        throw new RequestError(res);
      }

      const data = await res.json();

      return Array.isArray(opts?.decoders) ? opts.decoders.reduce((acc, decoder) => decoder(acc), data) : data;
    }
  })
}
