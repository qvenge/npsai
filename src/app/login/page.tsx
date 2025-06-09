
import { LoginForm } from './ui/login-form';
import { Logotype } from '@/shared/ui';

import { login } from './actions';
import styles from './page.module.scss';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className={styles.page}>
      <Logotype className={styles.logotype} />
      <Suspense>
        <LoginForm action={login} className={styles.form} />
      </Suspense>
    </div>
  );
}