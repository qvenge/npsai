import type { NextAuthConfig } from 'next-auth';

const guardedRoutes = ['/statistics', '/reviews', '/places', '/settings'];
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnDashboard = guardedRoutes.some(route => nextUrl.pathname.startsWith(route));

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/statistics', nextUrl));
      }

      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.access_token = user.access_token;
        token.id = user.id;
        token.email = user.email;
        token.places = user.places;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.access_token = token.access_token;

      session.user.id = token.id;
      session.user.email = token.email;
      session.user.places = token.places;

      return session;
    }
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.access_token = user.access_token;
    //   }
    //   return token;
    // },
    // async session({ session, token }) {
    //   session.access_token = token.access_token;
    //   return session;
    // }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;