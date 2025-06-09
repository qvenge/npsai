import { Skeleton, SkeletonItem, SkeletonText } from '@/shared/ui';

import styles from './place-card.module.scss';

export function InfoSkeleton() {
  return (
    <div className={styles.stats}>
      <InfoCardSkeleton />
      <InfoCardSkeleton />
      <InfoCardSkeleton />
    </div>
  );
}

function InfoCardSkeleton() {
  return (
    <Skeleton className={styles.stat}>
      <div className={styles.statHeader}>
        <SkeletonText className={styles.statLabel} style={{ width: 0 }} />
      </div>
      <SkeletonText className={styles.statValue} style={{ width: 0 }} />
    </Skeleton>
  )
}