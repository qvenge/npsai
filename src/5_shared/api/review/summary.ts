import { get, normalizeQuery } from '@/shared/api/request';
import { auth } from '@/auth';
import { type BaseReviewQuery } from './base-query';
import { normalizeReviewQuery } from './lib';

export interface ReviewSummaryCategory {
  name: string;
  count: number;
  summary_text?: string;
}

export interface ReviewSummaryStatus {
  count: number;
  list: ReviewSummaryCategory[];
}

export interface ReviewSummary {
  count: {
    positive: number;
    negative: number;
    neutral: number;
    spam: number;
    error: number;
    all: number;
  },
  ratings: {
    current_period: {
      nps: number;
      nps_with_spam: number,
      nps_by_user_ratings: number,
      csat: number
    },
    prev_period: {
      nps: number;
      nps_with_spam: number,
      nps_by_user_ratings: number,
      csat: number
    }
    nps: number;
    prev_nps: number;
    prev_csat: number;
    csat: number;
  },
  summary: {
    positive?: ReviewSummaryStatus;
    negative?: ReviewSummaryStatus;
    neutral?: ReviewSummaryStatus;
    spam?: ReviewSummaryStatus;
    error?: ReviewSummaryStatus;
  }
}

export type GetReviewSummaryQuery = BaseReviewQuery;

export async function getReviewSummary(query: GetReviewSummaryQuery, params: { access_token?: string } = {}): Promise<ReviewSummary> {
  if (params?.access_token == null) {
    const session = await auth();
    params.access_token = session?.access_token;
  }

  if (!query.place_id) {
    throw new Error('place_id is required');
  }

  const res = await get('/review/summary', normalizeReviewQuery(query), {
    accessToken: params.access_token
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const data = await res.json();

  return data.result as ReviewSummary;
}

