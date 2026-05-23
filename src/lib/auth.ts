import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        let user = await db.user.findUnique({
          where: { email },
        });

        // Auto-seed/ensure demo user exists with the correct password
        if (email === "demo@kosha.app") {
          if (!user) {
            user = await db.user.create({
              data: {
                name: "Kosha User",
                email: "demo@kosha.app",
                password: "password",
                currency: "INR",
              },
            });
          } else if (!user.password) {
            user = await db.user.update({
              where: { email: "demo@kosha.app" },
              data: { password: "password" },
            });
          }
        }

        if (!user || !user.password) return null;

        // Simple password comparison for demo (use bcrypt in production)
        if (user.password !== password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
