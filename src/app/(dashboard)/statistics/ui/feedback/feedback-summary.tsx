'use client';

import Image from 'next/image'
import { useState } from 'react';
import clsx from 'clsx';

import { TextButton } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { CaretDownBold } from '@/shared/ds/icons';

import styles from './feedback-summary.module.scss';
import avatar from './ai_avatar.svg';

export interface FeedbackSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}


export function FeedbackSummary({ text, className }: FeedbackSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const expand = () => {
    setExpanded(true);
  };

  return (
      <div className={clsx(className, styles.card, expanded && styles.cardExpanded)}>
        <div className={styles.header}>
          <Image
            src={avatar}
            className={styles.avatar}
            width={32}
            height={32}
            alt="avatar"
          />
          <div className={styles.author}>Анализ отзывов от ИИ</div>
        </div>
        <div
          className={styles.content}
        >
          {text}
        </div>
        <TextButton
          type="primary"
          size="m"
          className={styles.expandBtn}
          onClick={expand}
        >
          <div className={styles.expandBtnContent}>
            Еще
            <Icon
              src={CaretDownBold}
              width={16}
              height={16}
            />
          </div>
        </TextButton>
      </div>
  );
}