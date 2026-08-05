// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './app/db';
import { eq } from 'drizzle-orm';
import { users } from './app/db/schema';
import bcrypt from 'bcryptjs';

// --- ЭТОТ БЛОК ДЛЯ РАСШИРЕНИЯ ТИПОВ NEXTAUTH ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
// ----------------------------------------------------

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Ищем пользователя в БД по username
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username as string))
          .limit(1);

        if (!user) return null;

        // Проверяем соответствие введенного пароля и хеша в БД
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) return null;

        // Возвращаем объект пользователя для сессии
        return {
          id: user.id,
          name: user.name,
          email: user.username, // NextAuth ожидает email, запишем туда username для удобства
        };
      },
    }),
  ],
  // Расширяем JWT-токен и сессию, чтобы ID пользователя был доступен в компонентах
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Ссылка на кастомную страницу логина (создадим далее)
  },
  secret: process.env.AUTH_SECRET,
});
