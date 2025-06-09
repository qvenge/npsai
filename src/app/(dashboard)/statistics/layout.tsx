import { PlaceSelect } from '@/features/place-select';
import { PeriodRadio } from '@/features/period-radio';
import { DownloadButton } from '@/features/download-button';
import { getPlaces } from '@/shared/api';
import { Header } from '@/shared/ui';
import { Suspense } from 'react';

import styles from './layout.module.scss';

export default async function StatisticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const places = await getPlaces();

  return (
    <>
      <Header title={'Статистика'}>
        <Suspense>
          <PlaceSelect places={places} />
        </Suspense>
        <Suspense>
          <PeriodRadio />
        </Suspense>
        <Suspense>
          <DownloadButton />
        </Suspense>
      </Header>
      <div className={styles.page}>
        {children}
      </div>
    </>
  );
}