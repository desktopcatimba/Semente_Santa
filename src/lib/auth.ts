import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

type Admin = { username: string; passwordHash: string; displayName: string };

function getAdmins(): Admin[] {
  const admins: Admin[] = [];

  if (process.env.ADMIN_FRANCISCA_USER && process.env.ADMIN_FRANCISCA_PASSWORD_HASH) {
    admins.push({
      username: process.env.ADMIN_FRANCISCA_USER,
      passwordHash: process.env.ADMIN_FRANCISCA_PASSWORD_HASH,
      displayName: "Francisca",
    });
  }

  if (process.env.ADMIN_EDVALDO_USER && process.env.ADMIN_EDVALDO_PASSWORD_HASH) {
    admins.push({
      username: process.env.ADMIN_EDVALDO_USER,
      passwordHash: process.env.ADMIN_EDVALDO_PASSWORD_HASH,
      displayName: "Edvaldo",
    });
  }

  return admins;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Utilizador", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const admin = getAdmins().find(
          (a) => a.username.toLowerCase() === credentials.username.toLowerCase()
        );
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.username, name: admin.displayName };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.name as string;
      return session;
    },
  },
};
