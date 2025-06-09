'use client';

import clsx from 'clsx';
import { useState, useEffect, useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { infiniteQueryOptions } from '@tanstack/react-query'
import { useActualRemoteData, normalizeReviewQuery, ReviewListResponse, useReviewList } from '@/shared/api';
import { fetchRemoteData } from '@/shared/api/use-remote-data';

import { ReviewStatusIcon, Icon, ButtonContainer, Modal, VirtualScroll } from '@/shared/ui';
import { PlayCircleFill, WaveformFill, ArrowDownBold, ArrowUpBold } from '@/shared/ds/icons';

import { useAudioPlayer } from '@/shared/ui/audio-player';
import styles from './review-table-header.module.scss';

interface Column {
  label: string;
  name: string;
  className?: string;
  order?: {
    active: boolean;
    descending: boolean;
  }
}

export interface ReviewTableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onSortClick?: (name: string) => void;
  columns: Column[];
}

export function ReviewTableHeader<T = any>({columns, onSortClick, ...props}: ReviewTableHeaderProps) {
  return (
    <div className={clsx(props.className, styles.tHead)}>
      {columns.map(({label, name, className, order}) => (
        order ? (
          <ButtonContainer key={name} onClick={() => onSortClick?.(name)}>
            <div className={clsx(className, styles.thCell)}>
              {label}
              <Icon
                className={clsx(
                  styles.thIcon,
                  styles.sortIcon,
                  order.active && styles.sortIconActive
                )}
                src={order.descending ? ArrowDownBold : ArrowUpBold}
                width={16}
                height={16}
              />
            </div>
          </ButtonContainer>
        ) : (
          <div key={name} className={clsx(className, styles.thCell)}>{label}</div>
        )
      ))}
    </div>
  );
}