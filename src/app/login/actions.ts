import { z } from 'zod';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
 
export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(_: unknown, formData: FormData) {
  'use server';
  
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });
  } catch(err: any) {
    return {
      errors: {
        detail: err.cause?.err?.message ?? 'Неизвестная ошибка'
      }
    }
  }

  const callbackUrl = String(formData.get('callbackUrl'));
  redirect(callbackUrl ?? '/statisctics');
}