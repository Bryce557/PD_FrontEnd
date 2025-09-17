import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  //session: {
  //  strategy: 'jwt',
  //},
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isInExam = nextUrl.pathname.startsWith('/motorexam/fingertap');
      console.log('In auth.config.ts -- IsLoggedIn? ', isLoggedIn);
      console.log('isInExam? ', isInExam);
      if (isInExam && !isLoggedIn) {
        // Not logged in and trying to access exam
        return false; // Triggers redirect to /signin
      }

      return true; // Allow everything else
    },
  },
  providers: [], // Add providers
} satisfies NextAuthConfig;
