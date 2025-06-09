'use client';

import styles from './error.module.scss';
import { Button } from '@/shared/ui';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className={styles.root}>
        <h2 className={styles.message}>Что-то пошло не так</h2>
        <div className={styles.reloadButton}>
          <Button
            type="primary"
            size="l"
            onClick={() => reset()}
          >
            Перезагрузить
          </Button>
        </div>
      </body>
    </html>
  );
}
