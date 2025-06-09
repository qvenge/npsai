
import clsx from 'clsx';
import { auth } from '@/auth';
import { RedirectGuard } from '@/features/redirect-guard';
import { getReviewSummary, getReviewGraphData, type BaseReviewQuery } from '@/shared/api';
import { pick } from '@/shared/lib/object';

import { Summary, Chart, Feedback } from './ui';
import styles from './page.module.scss';

import { StatisticsContent } from './statistics-content';
import { Suspense } from 'react';

export default async function Statistics({searchParams: _searchParams}: {
  searchParams?: Promise<Record<string, string>>
}) {
  const searchParams = await _searchParams;

  return (
    <div className={styles.page}>
      <RedirectGuard searchParams={searchParams} pathname="/statistics" />
      <Suspense>
        <StatisticsContent />
      </Suspense>
    </div>
  );
}