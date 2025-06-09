'use client';

import { useTransition } from 'react'
import { Button } from '@/shared/ui';
import { logoutAction } from './actions';

export function LogoutButton(props: Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(logoutAction);
  };

  return (
    <Button
      type="negative"
      size="m"
      onClick={handleClick}
      loading={isPending}
      {...props}
    >
      Выйти
    </Button>
  );
}