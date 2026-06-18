import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database imports). Shared by middleware and the
 * full server-side auth. The Credentials provider (which touches the DB) is
 * added only in `src/auth.ts`.
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isLogin = pathname === "/admin/login";
      const isAdmin = pathname.startsWith("/admin");

      if (isLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }
      if (isAdmin) return isLoggedIn; // false → redirect to signIn page
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const u = user as { id?: string; name?: string | null; username?: string; role?: string };
        token.id = u.id;
        token.name = u.name ?? null;
        (token as Record<string, unknown>).username = u.username;
        (token as Record<string, unknown>).role = u.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const t = token as Record<string, unknown>;
        const u = session.user as unknown as Record<string, unknown>;
        u.id = t.id;
        u.username = t.username;
        u.role = t.role;
        if (typeof t.name === "string") session.user.name = t.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
