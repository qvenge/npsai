import { Header, Button } from '@/shared/ui';

import { AddPlaceButton } from './ui/add-place-button';
import styles from './layout.module.scss';

export default function PlacesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const addPlace = () => {};

  return (
    <>
      <Header title={'Мои заведения'}>
        <AddPlaceButton />
      </Header>
      <div className={styles.page}>
        {children}
      </div>
    </>
  );
}