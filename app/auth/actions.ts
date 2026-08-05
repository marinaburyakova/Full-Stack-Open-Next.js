// app/auth/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { db } from '../db';
import { users } from '../db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { signIn } from '../../auth'; // Импортируем строго из чистого auth.ts

// --- ТИПЫ И ЭКШЕН ДЛЯ РЕГИСТРАЦИИ (Упражнение 12 & 15) ---
export interface RegisterActionState {
  error?: string;
  fields?: {
    name: string;
    username: string;
  };
}

export async function registerUser(
  prevState: RegisterActionState, 
  formData: FormData
): Promise<RegisterActionState> {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;

  const currentFields = { name, username };

  if (!name || !username || !password || !passwordConfirm) {
    return { error: 'All fields are required', fields: currentFields };
  }
  if (username.trim().length < 4) {
    return { error: 'Username must be at least 4 characters long', fields: currentFields };
  }
  if (password.length < 4) {
    return { error: 'Password must be at least 4 characters long', fields: currentFields };
  }
  if (password !== passwordConfirm) {
    return { error: 'Passwords do not match', fields: currentFields };
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      return { error: 'Username is already taken', fields: currentFields };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.insert(users).values({
      username,
      name,
      passwordHash,
    });
  } catch (dbError) {
    console.error('Registration failed:', dbError);
    return { error: 'Registration failed due to a database error.', fields: currentFields };
  }

  redirect('/login');
}

// --- ДОБАВЛЕННЫЙ ИНТЕРФЕЙС СОСТОЯНИЯ ДЛЯ ВХОДА (ФИКС ОШИБКИ) ---
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
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const currentFields = { username };

  if (!username || !password) {
    return { error: 'Username and password are required', fields: currentFields };
  }

  try {
    // Вызываем метод signIn
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/blogs',
    });
  } catch (rawError) {
    const error = rawError as Error;

    // ВАЖНО: Если NextAuth делает успешный редирект, мы ОБЯЗАНЫ пробросить его дальше!
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("NextAuth Signin Error Log:", error.name, error.message);

    // Ловим ЛЮБЫЕ ошибки неверных данных (CredentialsSignin, CallbackRouteError и т.д.)
    if (
      error.message && 
      (error.message.includes('CredentialsSignin') || 
       error.message.includes('CallbackRouteError') || 
       error.name === 'CredentialsSignin')
    ) {
      return { error: 'Invalid username or password', fields: currentFields };
    }

    // Если произошел сбой из-за чего-то другого
    return { error: 'Invalid username or password', fields: currentFields };
  }

  return {};
}
