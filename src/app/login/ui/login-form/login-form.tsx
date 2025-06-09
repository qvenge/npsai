'use client';

import Form from 'next/form'
import { use, useActionState } from 'react';

import { useSearchParams } from 'next/navigation';

import clsx from 'clsx';
import { Button, TextInput } from '@/shared/ui';

import styles from './login-form.module.scss';

export type FormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export interface LoginFormProps extends React.HTMLAttributes<HTMLFormElement> {
  action: (state: FormState, data: FormData) => Promise<any>;
}

export function LoginForm({
  className,
  action: _action,
  ...props
}: LoginFormProps) {
  const [state, action, pending] = useActionState(_action, undefined);
  const searchParams = useSearchParams();

  return (
    <Form className={clsx(className, styles.root)} action={action} {...props}>
      <input type="hidden" name="callbackUrl" value={searchParams.get('callbackUrl') ?? '/'} />
      <h1 className={styles.title}>Авторизация</h1>
      <div className={styles.inputs}>
        <TextInput
          type="email"
          name="email"
          label="Логин"
          placeholder="Введите логин"
          error={Boolean(state?.errors?.email)}
          hint={state?.errors?.email && state.errors.email}
          disabled={pending}
          required
        />
        <TextInput
          type="password"
          name="password"
          label="Пароль"
          placeholder="Введите пароль"
          error={Boolean(state?.errors?.password)}
          hint={state?.errors?.password && state.errors.password}
          disabled={pending}
          required
        />
      </div>
      <div className={styles.footer}>
        <Button
          type="primary"
          htmlType="submit"
          size="l"
          loading={pending}
        >
          Войти
        </Button>
        <p className={styles.errorMessage}>{state?.errors?.detail}</p>
      </div>
    </Form>
  );
}