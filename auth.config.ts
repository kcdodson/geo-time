import type { NextAuthConfig } from "next-auth";

const publicPaths = ["/login", "/register", "/api/auth"];

// Edge-compatible config — no Prisma or bcryptjs imports
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isPublic = publicPaths.some((p) => pathname.startsWith(p));
      const isAuthenticated = !!auth?.user;

      if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      if (!isPublic && !isAuthenticated) {
        return Response.redirect(new URL("/login", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // providers added in lib/auth.ts, not needed for Edge middleware
};
