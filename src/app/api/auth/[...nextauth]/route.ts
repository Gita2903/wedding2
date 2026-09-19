import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getRequestIdentifier, resetRateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email || !credentials?.password) {
          throw new Error("Email atau password salah");
        }

        const requestIdentifier = getRequestIdentifier(
          request.headers as Record<string, unknown> | undefined,
        );
        const rateLimitKey = `login:${requestIdentifier}:${email}`;
        const rateLimit = checkRateLimit(rateLimitKey, { limit: 5, windowMs: 15 * 60 * 1000 });
        if (!rateLimit.allowed) {
          throw new Error("Terlalu banyak percobaan. Coba lagi nanti.");
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        resetRateLimit(rateLimitKey);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          weddingId: user.weddingId
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.weddingId = (user as { weddingId?: string | null }).weddingId;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
      }
      // Re-fetch weddingId from the DB so a freshly created wedding
      // is picked up without requiring a full re-login.
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { weddingId: true },
        });
        token.weddingId = dbUser?.weddingId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          weddingId?: string | null;
        };
        sessionUser.id = token.id as string;
        sessionUser.weddingId = token.weddingId as string | null | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
