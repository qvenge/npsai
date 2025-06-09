'use client';

import { useCallback, useMemo } from 'react';
import { useReviewQuery, type BaseReviewQuery, type Period } from './base-query';

export type CustomPeriod = `["${string}","${string}"]` | `["${string}"]`;
export type InputPeriod = Exclude<Period, 'custom'> | CustomPeriod;

export function usePeriod(): [Pick<BaseReviewQuery, 'period' | 'period_from' | 'period_to'> | null, (period: InputPeriod) => void] {
  const [query, setQuery] = useReviewQuery();

  const state = useMemo(() => ({
    period: query.period,
    period_from: query.period_from,
    period_to: query.period_to
  }), [query]);

  const setPeriod = useCallback((period: InputPeriod) => {
    setQuery({
      ...query,
      ...calcPeriodQuery(period),
    });
  }, [query, setQuery]);

  return [
    state,
    setPeriod
  ];
}

function calcPeriodQuery(inputPeriod: InputPeriod): {
  period: Period,
  period_to: string | null,
  period_from: string | null
} {
  let period: Period = 'all';

  if (inputPeriod === 'all') {
    return {
      period,
      period_from: null,
      period_to: null
    };
  }

  const periodTo = new Date();
  const periodFrom = new Date();

  switch (inputPeriod) {
    case 'week':
      period = 'week';
      periodFrom.setDate(periodFrom.getDate() - 7);
      break;
    case 'month':
      period = 'month';
      periodFrom.setMonth(periodFrom.getMonth() - 1);
      break;
    case 'year':
      period = 'year';
      periodFrom.setFullYear(periodFrom.getFullYear() - 1);
      break;

    default:
      try {
        const [period_from, period_to] = JSON.parse(inputPeriod);

        return {
          period: 'custom',
          period_from,
          period_to
        };
      } catch (e) {
        throw new Error(`Invalid period: ${period}`);
      }
  }

  return {
    period,
    period_from: periodFrom.toISOString(),
    period_to: periodTo.toISOString()
  }
};