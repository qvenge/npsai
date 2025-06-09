import { Header } from '@/shared/ui';
import styles from './layout.module.scss';

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header title={'Настройки'} />
      <div className={styles.page}>
        {children}
      </div>
    </>
  );
}