'use client';

import clsx from 'clsx';
import { useState, useRef } from 'react';
import { infiniteQueryOptions, useQueryClient } from '@tanstack/react-query'
import { ReviewListResponse, ReviewSummaryCategory, useSpecificQuery } from '@/shared/api';
import { fetchRemoteData } from '@/shared/api/use-remote-data';

import { ButtonContainer, VirtualScroll } from '@/shared/ui';
import styles from './feedback-modal.module.scss';

interface AllReviewsModalProps {
  title: string;
  categories: ReviewSummaryCategory[];
  reviewType: string;
}

export function AllReviewsModal({ title, categories, reviewType }: AllReviewsModalProps) {
  const [searchParams] = useSpecificQuery(['place_id', 'period_from', 'period_to']);
  const listRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState<string>(categories.length > 0 ? categories[0].name : '');

  if (searchParams?.place_id == null) {
    return null;
  }

  const query = {
    ...searchParams,
    order_by: 'date',
    size: 10,
    descending: false,
    category_filter: `${reviewType}:${activeCategory}`
  };

  const options = infiniteQueryOptions<any>({
    queryKey: ['reviewList', query],
    queryFn: ({ pageParam }: any) => fetchRemoteData<ReviewListResponse>('reviews', { page: pageParam, ...query}),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1
  });

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.categories}>
          {categories.map((category, i) => (
            <ButtonContainer
              onClick={() => setActiveCategory(category.name)}
            >
              <div
                key={category.name}
                className={clsx(styles.category, activeCategory === category.name && styles.categoryActive)}
              >
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categoryCount}>{category.count}</div>
              </div>
            </ButtonContainer>
          ))}
        </div>
      </div>
      <div ref={listRef} className={styles.reviews}>
        <VirtualScroll
          parentRef={listRef}
          estimateSize={() => 100}
          ItemComponent={({item, index}) => (
            <div key={item.id} className={styles.review}>{item.transcript}</div>
          )}
          queryOptions={options}
          LoaderComponent={() => <div className={styles.loader}>Загрузка...</div>}
          EmptyComponent={() => <div className={styles.empty}>Нет отзывов</div>}
          convertorFn={(data: any) => data.result}
        />
        {/* {reviews?.length > 0 && reviews.map(({id, transcript}) => (
          <div key={id} className={styles.review}>{transcript}</div>
        ))} */}
      </div>
    </div>
  );
}