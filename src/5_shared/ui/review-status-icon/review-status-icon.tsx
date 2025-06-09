import clsx from 'clsx';
import type { StaticImageData } from 'next/image';

import { Icon } from '@/shared/ui/icon';
import type { IconProps } from '@/shared/ui/icon';

import { camelize } from '@/shared/lib';
import { SmileyFill, SmileyAngryFill, SmileyMehFill, SmileySadFill, WarningCircleFill, XCircleFill } from '@/shared/ds/icons';

import styles from './review-status-icon.module.scss';

type ReviewStatus = 'positive' | 'neutral' | 'negative' | 'spam' | 'error' | 'angry';
type ReviewEmo = -1 | 0 | 1;

export interface ReviewStatusIconProps extends Omit<IconProps, 'src'> {
  value: ReviewEmo | ReviewStatus;
}

const statusIcons: Record<ReviewStatus, StaticImageData> = {
  positive: SmileyFill,
  neutral: SmileyMehFill,
  negative: SmileySadFill,
  spam: WarningCircleFill,
  error: XCircleFill,
  angry: SmileyAngryFill
};

const emoStatuses: Record<ReviewEmo, ReviewStatus> = {
  '1': 'positive',
  '0': 'neutral',
  '-1': 'angry',
};

export function ReviewStatusIcon({
  value,
  className,
  ...props
}: ReviewStatusIconProps) {
  const status = typeof value === 'number' ? emoStatuses[value] : value;

  return (
    <Icon
      className={clsx(className, styles.icon, styles[`icon${camelize(status)}`])}
      src={statusIcons[status].src}
      {...props}
    />
  );
}