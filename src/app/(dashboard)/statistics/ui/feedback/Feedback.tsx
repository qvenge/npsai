import clsx from 'clsx';

import { BaseReviewQuery, ReviewSummary } from '@/shared/api'
import { SmileyMehBold, ThumbsUpBold, ThumbsDownBold } from '@/shared/ds/icons';

import { FeedbackBlock } from './feedback-block';
import styles from './feedback.module.scss';

const labels = {
  positive: 'Положительные',
  neutral: 'Нейтральные',
  negative: 'Отрицательные',
};

const icons = {
  positive: ThumbsUpBold,
  neutral: SmileyMehBold,
  negative: ThumbsDownBold,
}

export interface FeedbackProps {
  data: ReviewSummary;
}

export function Feedback({data}: FeedbackProps) {
  const items = Object.entries(data.summary).map(([key, value]) => ({
    ...value,
    name: key,
    // @ts-ignore
    title: labels[key],
    // @ts-ignore
    icon: icons[key],
  }))

  return (
    <div className={styles.root}>
      {items.map((item) => (
        <FeedbackBlock key={item.name} data={item} />
      ))}
    </div>
  )
}
