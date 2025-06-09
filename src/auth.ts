import NextAuth, { type User as NextAuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';

import { LoginData, login, getUser, type User } from '@/shared/api';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string;
    user: User;
  }
}
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt", // или 'database', если хранишь сессии в БД
  },
  providers: [
    Credentials({
      async authorize(credentials): Promise<{email: string, access_token: string} | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const res = await login(parsedCredentials.data);
          
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Ошибка авторизации");
          }

          const { access_token } = await res.json();

          if (!access_token) {
            throw new Error("Ошибка авторизации");
          }

          const user = await getUser(access_token);
          if (!user) return null;

          return {
            ...user,
            access_token
          };
        }
 
        return null;
      },
    }),
  ],
});