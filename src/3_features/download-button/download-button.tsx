'use client';

import { useTransition } from 'react';
import { IconButton } from '@/shared/ui';
import { ArrowLineDownBold } from '@/shared/ds/icons';
import { useSpecificQuery, API_HOST } from '@/shared/api';

import { prepareDownloadAction } from './action';
import { getEventSourceData, downloadFile } from './lib'

export function DownloadButton() {
  const [query] = useSpecificQuery<{place_id: string}>(['place_id']);
  const [isPending, startTransition] = useTransition();
  
  const handleDownload = () => {
    if (query?.place_id) {
      startTransition(async () => {
        await prepareDownloadAction(query.place_id);
        const data = await getEventSourceData<{file_path: string, upload_id: string}>();
        await downloadFile(data.file_path);
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
