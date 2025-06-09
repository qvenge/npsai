import { NextRequest } from 'next/server';
import { requestApi, getReviewList, ReviewListQuery, normalizeReviewQuery } from '@/shared/api';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const query = ReviewListQuery.parse(normalizeReviewQuery({
    place_id: searchParams.get('place_id'),
    period_from: searchParams.get('period_from'),
    period_to: searchParams.get('period_to'),
    order_by: searchParams.get('order_by'),
    descending: searchParams.get('descending') === 'true',
    page: Number(searchParams.get('page') ?? 1),
    size: Number(searchParams.get('size') ?? 10),
    review_type_filter: searchParams.get('review_type_filter'),
    category_filter: searchParams.get('category_filter'),
  }));

  const data = await getReviewList(query);

  return Response.json(data);
}
