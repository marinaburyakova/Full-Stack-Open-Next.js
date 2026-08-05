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
        if (!credentials?.username || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username as string))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) return null;

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

// --- ЭТАЛОННАЯ ОБЕРТКА ДЛЯ ВХОДА (ПАТТЕРН AUTH.JS V5) ---
export interface LoginActionState {
  error?: string;
  fields?: {
    username: string;
  };
}

export async function loginUserAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  'use server'; // Явно указываем, что это Server Action

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const currentFields = { username };

  if (!username || !password) {
    return { error: 'Username and password are required', fields: currentFields };
  }

  try {
    // Вызываем signIn напрямую из контекста NextAuth
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/blogs',
    });
  } catch (rawError) {
    const error = rawError as Error;

    // Критически важно для Next.js: пропускаем ошибку редиректа дальше
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    if (
      error.message && 
      (error.message.includes('CredentialsSignin') || error.message.includes('CallbackRouteError'))
    ) {
      return { error: 'Invalid username or password', fields: currentFields };
    }

    return { error: 'Something went wrong during login.', fields: currentFields };
  }

  return {};
}
