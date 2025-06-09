import { get } from '@/shared/api/request';
import { auth } from '@/auth';
import { type BaseReviewQuery } from './base-query';
import { normalizeReviewQuery } from './lib';

export interface ReviewGraphData {
  /**
   * Дата первой точки, шаг - 1 день
   */
  first_date: string;

  /**
   * Дата последный точки
   */
  last_date: string;

  positive: number[];
  neutral: number[];
  negative: number[];
  spam: number[];
  error: number[];
}

export type GetReviewGraphDataQuery = BaseReviewQuery;

export async function getReviewGraphData(
  query: GetReviewGraphDataQuery
): Promise<ReviewGraphData> {
  const session = await auth();

  const res = await get('/review/graph_data', normalizeReviewQuery(query), {
    accessToken: session?.access_token
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  return data as ReviewGraphData;
}