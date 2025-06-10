import clsx from 'clsx';

import { BaseReviewQuery, ReviewSummary } from '@/shared/api'
import { SmileyMehBold, ThumbsUpBold, ThumbsDownBold } from '@/shared/ds/icons';

import { FeedbackBlock } from './feedback-block';
import styles from './feedback.module.scss';

const labels = {
  'похвала': 'Положительные',
  'критика': 'Отрицательные',
};

const icons = {
  'похвала': ThumbsUpBold,
  'критика': ThumbsDownBold,
}

export interface FeedbackProps {
  data: ReviewSummary;
}

export function Feedback({data}: FeedbackProps) {
  const items = Object.entries(data.summary).filter(([key]) => key in labels).map(([key, value]) => ({
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
