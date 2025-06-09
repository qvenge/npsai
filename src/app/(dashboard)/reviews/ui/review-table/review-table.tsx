'use client';

import clsx from 'clsx';
import { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { infiniteQueryOptions, useQueryClient } from '@tanstack/react-query'
import { ReviewListResponse } from '@/shared/api';
import { fetchRemoteData } from '@/shared/api/use-remote-data';

import { useSpecificQuery } from '@/shared/api/use-specific-query';

import { ReviewStatusIcon, Icon, ButtonContainer, Modal, VirtualScroll } from '@/shared/ui';
import { PlayCircleFill, WaveformFill, ArrowDownBold, ArrowUpBold } from '@/shared/ds/icons';

import { useAudioPlayer } from '@/shared/ui/audio-player';
import styles from './review-table.module.scss';

import { ReviewTableRow } from '../review-table-row';
import { ReviewTableHeader } from '../review-table-header';
import { setUserRatingAction } from '../../actions';

type SortableColumn = 'date' | 'rating';

export function ReviewTable() {
  const queryClient = useQueryClient();
  const [searchParams] = useSpecificQuery(['place_id', 'period_from', 'period_to']);
  const tBodyRef = useRef(null);
  const [audioState, dispatch] = useAudioPlayer();
  const [orderBy, setOrderBy] = useState<SortableColumn>('date');
  const [descending, setDescending] = useState<{date: boolean, rating: boolean}>({
    date: false,
    rating: false
  });

  const playReview = (src: string) => dispatch({
    type: 'SET_SOURCE',
    payload: {
      src,
      isPlaying: true
    }
  });

  const handleSortClick = (name: SortableColumn) => {
    if (orderBy === name) {
      setDescending({
        ...descending,
        [name]: !descending[name]
      });
    } else {
      setOrderBy(name);
    }
  }

  const query = {
    ...searchParams,
    order_by: orderBy,
    size: 10,
    descending: descending[orderBy]
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

  const handleChangeUserRating = useCallback(async (review_id: number, user_rating: string) => {
    const res = await setUserRatingAction(review_id, user_rating);

    if (!res) {
      return false;
    }

    queryClient.setQueryData(['reviewList', query], (data: any) => {
      return {
        ...data,
        pages: data.pages.map((page: ReviewListResponse) => {
            return {
              ...page,
              result: page.result.map((item) => {
                if (item.id === review_id) {
                  return {
                    ...item,
                    user_rating
                  };
                }
                return item;
              })
            }
          })
      };
    })

    return true;
  }, [queryClient])

  return (
    <div className={styles.table}>
      <ReviewTableHeader
        className={styles.thead}
        columns={[
          {name: 'reviews', label: 'Отзывы'},
          {name: 'rating', label: 'Статус', order: { active: orderBy === 'rating', descending: descending['rating'] }},
          {name: 'date', label: 'Дата', order: { active: orderBy === 'date', descending: descending['date'] }},
          {name: 'emotions', label: 'Эмоции'},
          {name: 'user_rating', label: 'Польз. оценка'},
        ]}
        onSortClick={(name: string) => handleSortClick(name as SortableColumn)}
      />
      <div className={styles.tbody} ref={tBodyRef}>
        <VirtualScroll
          parentRef={tBodyRef}
          estimateSize={() => 80}
          ItemComponent={({item, index}) => (
            <ReviewTableRow
              item={item}
              isPlaying={audioState.src === `/api/review/audio?file=${item.file.split('/').pop()}` && audioState.isPlaying}
              playReview={playReview}
              onChangeUserRating={handleChangeUserRating}
            />
          )}
          LoaderComponent={() => <div className={styles.loader}>Загрузка...</div>}
          EmptyComponent={() => <div className={styles.empty}>Нет отзывов</div>}
          queryOptions={options}
          convertorFn={(data: any) => data.result}
        />
      </div>
    </div>
  );
}
