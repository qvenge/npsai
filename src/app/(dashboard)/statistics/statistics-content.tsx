'use client';

import clsx from 'clsx';
import { auth } from '@/auth';
import { RedirectGuard } from '@/features/redirect-guard';
import { ReviewSummary, useActualRemoteData } from '@/shared/api';
import { pick } from '@/shared/lib/object';

import { Summary, Chart, Feedback } from './ui';
import styles from './page.module.scss';

export function StatisticsContent() {
  const {data: summaryData, isSuccess: isSummarySuccess} = useActualRemoteData<ReviewSummary>('summary');
  const {data: chartData, isSuccess: isChartDataSuccess} = useActualRemoteData('chartData');

  return (
  <div className={styles.pageContent}>
    <div className={styles.pageBlock}>
      {isSummarySuccess && <Summary data={summaryData} />}
    </div>
    <div className={styles.pageBlock}>
      {isChartDataSuccess && <Chart data={chartData} />}
    </div>
    <div className={styles.pageBlock}>
      {isSummarySuccess && <Feedback data={summaryData} />}
    </div>
  </div>
  );
}