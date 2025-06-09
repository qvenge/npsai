import { type ReviewGraphData } from '@/shared/api';

interface DataItem {
  date: string;
  label: string;
  positive: number;
  neutral: number;
  negative: number;
  spam: number;
}

export interface NormalizedChartData {
  data: DataItem[];
  domain: [number, number];
}

interface IntarvalInfo {
  from: Date;
  to: Date;
  days: number;
}

type Interval = 'day' | 'week' | 'month' | 'year';

const formatDay = new Intl.DateTimeFormat('ru-RU', { day: '2-digit' });
const formatMonth = new Intl.DateTimeFormat('ru-RU', { month: '2-digit' });
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

function calcAverage(arr: number[], from: number, to: number) {
  return Math.round(arr.slice(from, to).reduce((a, b) => a + b, 0) / (to - from));
}

const dayMs = 24 * 60 * 60 * 1000;

export function normalizeChartData(rawData: ReviewGraphData, interval?: Interval): NormalizedChartData {
  const result: DataItem[] = [];
  const len = Math.min(rawData.positive.length, rawData.neutral.length, rawData.negative.length, rawData.spam.length);
  const _firstDate = new Date(rawData.first_date);
  const firstDate = new Date(_firstDate.getFullYear(), _firstDate.getMonth(), _firstDate.getDate());
  const lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + len);
  const middleDate = new Date((lastDate.getTime() + firstDate.getTime()) / 2);

  if (!interval) {
    interval = calcOptimalInterval(len);
  }

  let max = 0;
  let i = 0;

  const getLabel = (from: Date, to: Date, i: number, days: number): string => {
    const fromLabel = dateFormatter.format(from);
    const toLabel = dateFormatter.format(to);

    if (fromLabel == toLabel) {
      return fromLabel;
    }

    return `${fromLabel} - ${toLabel}`;
  }

  for (let { from, to, days } of intervalGenerator(firstDate, len, interval)) {
    const values = {
      positive: calcAverage(rawData.positive, i, i + days),
      neutral: calcAverage(rawData.neutral, i, i + days),
      negative: calcAverage(rawData.negative, i, i + days),
      spam: calcAverage(rawData.spam, i, i + days)
    };

    max = Math.min(max, ...Object.values(values));

    result.push({
      date: JSON.stringify(from.getTime() === to.getTime() ? [from] : [from, to]),
      label: getLabel(from, to, i, days),
      ...values
    });

    i += days;
  }

  return {
    data: result,
    domain: [0, max]
  }
}

function calcOptimalInterval(days: number): Interval {
  if (days > 365) {
    return 'month';
  }

  if (days > 30) {
    return 'week';
  }

  return 'day';
}

function* intervalGenerator(
  firstDate: Date,
  allDays: number,
  interval: Interval,
): Generator<IntarvalInfo> {
  let from = new Date(firstDate.getTime());
  let remainingDays = allDays;

  while (remainingDays > 0) {
    const nextDate = getNextDate(from, interval);
    const days = Math.floor((nextDate.getTime() - from.getTime()) / dayMs);

    if (days > remainingDays) {
      yield {
        from,
        to: new Date(from.getTime() + remainingDays * dayMs),
        days: remainingDays
      }
      return;
    }

    yield { from, to: new Date(nextDate.getTime() - dayMs), days };

    from = nextDate;
    remainingDays -= days;
  }
}

function getNextDate(date: Date, interval: Interval): Date {
  switch (interval) {
    case 'day':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    case 'week':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
    case 'month':
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    case 'year':
      return new Date(date.getFullYear() + 1, 0, 1);
    default:
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }
}
