'use client';

import { useTransition } from 'react';
import { IconButton } from '@/shared/ui';
import { ArrowLineDownBold } from '@/shared/ds/icons';
import { useSpecificQuery } from '@/shared/api';

import { prepareDownloadAction } from './action';

export function DownloadButton() {
  const [query] = useSpecificQuery<{place_id: string}>(['place_id']);
  const [isPending, startTransition] = useTransition();
  
  const handleDownload = () => {
    if (query?.place_id) {
      startTransition(async () => {
        await prepareDownloadAction(query.place_id);
      });
    }
  };

  return (
    <IconButton
      src={ArrowLineDownBold}
      size='l'
      type='primary'
      loading={isPending}
      onClick={handleDownload}
    />
  );
}
