'use client';

import { Suspense, useEffect, useState } from 'react';
import clsx from 'clsx';

import { pluralize, capitalize } from '@/shared/lib/string';
import { CaretRightBold } from '@/shared/ds/icons';
import { Icon, Modal, TextButton } from '@/shared/ui';
import { ReviewSummaryStatus, BaseReviewQuery } from '@/shared/api'
import { AllReviewsModal } from './feedback-modal';

import { FeedbackSummary } from './feedback-summary';
import styles from './feedback-block.module.scss';

export interface FeedbackBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name: string;
    title: string;
    // @ts-ignore
    icon: any;
  } & ReviewSummaryStatus;
}

export function FeedbackBlock({ data, className }: FeedbackBlockProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number>(0);

  useEffect(() => {
    setActiveCategory(0);
  }, [data])

  return (
    <div className={clsx(styles.feedbackBlock, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.title}</h2>
        <TextButton
            className={styles.viewAllBtn}
            type="primary"
            size="m"
            onClick={() => setModalOpen(!isModalOpen)}
          >
          <div className={styles.viewAllBtnContent}>
            {`Смотреть все ${data.count} ${pluralize(data.count, ['отзыв', 'отзыва', 'отзывов'])}`}
            <Icon
              className={styles.viewAllBtnArrow}
              src={CaretRightBold}
              width={16}
              height={16}
            />
          </div>
        </TextButton>
        {isModalOpen &&
          <Modal onClose={() => setModalOpen(false)}>
            <Suspense>
              <AllReviewsModal categories={data.list} title={data.title} reviewType={data.name} />
            </Suspense>
          </Modal>
        }
      </div>
      {data.list.length > 0 ? (
        <>
          <div className={styles.categories}>
            {data.list.map((item: any, index: number) => (
              <button
                key={index}
                className={clsx(styles.category, index === activeCategory && styles.categoryActive)}
                onClick={() => setActiveCategory(index)}
              >
                <div className={styles.categoryName}>{capitalize(item.name, true)}</div>
                <div className={styles.categoryInfo}>
                  <Icon className={styles.categoryIcon} src={data.icon} />
                  <div className={styles.categoryPercent}>
                    {`${(item.count /data.count * 100).toFixed(0)}%`}
                  </div>
                  <div className={styles.categoryCount}>{`${item.count} ${pluralize(item.count, ['отзыв', 'отзыва', 'отзывов'])}`}</div>
                </div>
              </button>
            ))}
          </div>
        {data.list[activeCategory]?.summary_text && <FeedbackSummary text={data.list[activeCategory].summary_text} />}
        </>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Нет отзывов</div>
        </div>
      )}
    </div>
  );
}
