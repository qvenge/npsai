'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { type ReviewItem } from '@/shared/api';

import { Icon, ButtonContainer, Modal } from '@/shared/ui';
import { PlayCircleFill, WaveformFill } from '@/shared/ds/icons';

import styles from './review.module.scss';

export interface ReviewContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ReviewItem;
  isPlaying: boolean;
  playReview: (src: string) => void;
}

export function ReviewContent({data, isPlaying, playReview, className, ...props}: ReviewContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileUrl = `/api/review/audio?file=${data.file.split('/').pop()}`;

  return (
    <div className={clsx(className, styles.root)} {...props}>
      <ButtonContainer
        className={styles.playButton}
        onClick={() => playReview(fileUrl)}
      >
        <Icon
          className={styles.playIcon}
          src={isPlaying ? WaveformFill : PlayCircleFill}
          width={32}
          height={32}
        />
      </ButtonContainer>
      <ButtonContainer onClick={() => setIsModalOpen(true)}>
        <div className={styles.text}>{data.transcript}</div>
      </ButtonContainer>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modalText}>{data.transcript}</div>
        </div>
      </Modal>} 
    </div>
  );
}
