// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from './app/db';
import { eq } from 'drizzle-orm';
import { users } from './app/db/schema';
import bcrypt from 'bcryptjs';

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("LOG: Пустые учетные данные при входе");
          return null;
        }

        console.log(`LOG: Попытка входа для пользователя: ${credentials.username}`);

        // Ищем пользователя в БД по username
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username as string))
          .limit(1);

        if (!user) {
          console.log(`LOG: Пользователь ${credentials.username} НЕ найден в базе данных!`);
          return null;
        }

        console.log(`LOG: Пользователь найден. Его имя: ${user.name}. Проверяю хэш пароля...`);

        if (!user.passwordHash) {
          console.log("LOG: У пользователя отсутствует passwordHash в базе!");
          return null;
        }

        // Проверяем соответствие введенного пароля и хеша в БД
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) {
          console.log("LOG: КРИТИЧЕСКАЯ ОШИБКА: bcrypt.compare вернул false! Пароль не совпал.");
          return null;
        }

        console.log("LOG: 🎉 УСПЕХ: Пароли совпали! Создаю сессию для пользователя.");

        return {
          id: user.id,
          name: user.name,
          email: user.username, 
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
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
});
