import { RedirectGuard } from '@/features/redirect-guard';
import { AudioPlayer, AudioPlayerProvider } from '@/shared/ui/audio-player';

import styles from './page.module.scss';
import { ReviewTable } from './ui';
import { Suspense } from 'react';

export default async function Reviews({searchParams: _searchParams}: {
  searchParams?: Promise<Record<string, string>>
}) {
  const searchParams = await _searchParams ?? {};

  return (
    <div className={styles.pageContent}>
      <RedirectGuard searchParams={searchParams} pathname='/reviews' />
      <AudioPlayerProvider>
        <Suspense>
          <ReviewTable />
        </Suspense>
        <div className={styles.player}>
          <AudioPlayer />
        </div>
      </AudioPlayerProvider>
    </div>
  );
}