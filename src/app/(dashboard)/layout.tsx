import { SessionProvider } from 'next-auth/react';

import { NavigationBar, SupportButton } from '@/shared/ui';
import { PageContextProvider, QueryProvider } from '@/shared/lib'

import { navItems } from './nav-items';
import styles from './layout.module.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <SessionProvider>
        <QueryProvider>
          <PageContextProvider pages={navItems.map(({id, title}) => ({id, title}))}>
            <NavigationBar className={styles.sidebar} items={navItems} />
            <main className={styles.main}>
              {children}
            </main>
            {process.env.NEXT_PUBLIC_SUPPORT_LINK && <SupportButton
              className={styles.supportButton}
              href={process.env.NEXT_PUBLIC_SUPPORT_LINK}
            />}
          </PageContextProvider>
        </QueryProvider>
      </SessionProvider>
    </div>
  );
}
