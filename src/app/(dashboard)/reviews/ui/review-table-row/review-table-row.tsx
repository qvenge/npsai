import clsx from 'clsx';

import { useState } from 'react';
import { ReviewStatusIcon, Select } from '@/shared/ui';
import { ReviewItem } from '@/shared/api';

import { ReviewContent } from '../review';
import styles from './review-table-row.module.scss';

const statusLabels = {
  'spam': 'Спам',
  'negative': 'Отрицательный',
  'positive': 'Положительный',
  'neutral': 'Нейтральный',
  'error': 'Ошибка'
};

const dateFormatter = new Intl.DateTimeFormat('ru', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('ru', {
  hour: 'numeric',
  minute: 'numeric'
});


export interface ReviewTableRowProps {
  item: ReviewItem;
  isPlaying: boolean;
  playReview: (src: string) => void;
  onChangeUserRating: (id: number, rating: string) => Promise<boolean>;
}

export function ReviewTableRow({
  item,
  isPlaying,
  playReview,
  onChangeUserRating
}: ReviewTableRowProps) {
  const [userRating, setUserRating] = useState(item.user_rating);

  const handleSelectUserRating = async (id: number, rating: string) => {
    const prevRating = userRating;
    setUserRating(rating);
    const res = await onChangeUserRating(id, rating);

    if (!res) {
      setUserRating(prevRating);
    }
  }

  return (
    <div className={styles.row}>
      <div className={styles.cell}>
        <ReviewContent
          data={item}
          playReview={playReview}
          isPlaying={isPlaying}
        />
      </div>
      <div className={styles.cell}>
        <ReviewStatus rating={item.rating} />
      </div>
      <div className={clsx(styles.cell, styles.created)}>
        <div className={styles.createdDate}>{dateFormatter.format(new Date(item.ts))}</div>
        <div className={styles.createdTime}>{timeFormatter.format(new Date(item.ts))}</div>
      </div>
      <div className={clsx(styles.cell, styles.emo)}>
        <ReviewStatusIcon
          value={Math.round(item.emo) as -1 | 0 | 1}
          width={20}
          height={20}
        />
        {item.emo}
      </div>
      <div className={clsx(styles.cell, styles.userRating)}>
        <Select
          className={styles.userRatingSelect}
          value={userRating}
          align='right'
          options={
            [
              { label: <ReviewStatus rating='Не задана' />, value: '' },
              { label: <ReviewStatus rating='positive'/>, value: 'positive' },
              { label: <ReviewStatus rating='neutral'/>, value: 'neutral' },
              { label: <ReviewStatus rating='negative'/>, value: 'negative' },
              { label: <ReviewStatus rating='spam'/>, value: 'spam' },
              { label: <ReviewStatus rating='error'/>, value: 'error' }
            ]
          }
          onChange={(value: any) => handleSelectUserRating(item.id, value)}
        />
      </div>
    </div>
  );
}

function ReviewStatus({rating}: {rating: string}) {
  const ratingLabel = statusLabels[rating as keyof typeof statusLabels]

  if (!ratingLabel) {
    return (
      <div className={styles.rating}>
        <div className={styles.ratingText}>
          {rating}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rating}>
      <ReviewStatusIcon
        className={styles.cellIcon}
        // @ts-ignore
        value={rating}
        width={20}
        height={20}
      />
      <div className={styles.ratingText}>
        {ratingLabel}
      </div>
    </div>
  )
}