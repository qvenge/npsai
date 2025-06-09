import { useInfiniteQuery } from '@tanstack/react-query';
import { GetReviewListQuery, type ReviewListResponse } from './review';
import { fetchRemoteData } from './use-remote-data';


export function useReviewList(query: Omit<GetReviewListQuery, 'page'>, initialPage = 1) {
  return useInfiniteQuery({
    queryKey: ['reviewList'],
    queryFn: ({ pageParam }) => fetchRemoteData<ReviewListResponse>('reviews', { ...query, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: initialPage
  });
}
