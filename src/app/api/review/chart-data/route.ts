import { NextRequest } from 'next/server';
import { requestApi, getReviewSummary, getReviewGraphData } from '@/shared/api';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const query = {
    place_id: searchParams.get('place_id'),
    period_from: searchParams.get('period_from'),
    period_to: searchParams.get('period_to'),
  };

  const data = await getReviewGraphData(query);

  return Response.json(data);
}
