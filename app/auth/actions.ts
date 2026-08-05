'use server';

import { redirect } from 'next/navigation';
import { db } from '../db';
import { users } from '../db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

// Описываем тип состояния для формы регистрации
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

  // Сохраняем имя и логин, чтобы вернуть их в инпуты (пароли из соображений безопасности не возвращаем)
  const currentFields = { name, username };

  // 1. Проверка наличия всех полей
  if (!name || !username || !password || !passwordConfirm) {
    return { error: 'All fields are required', fields: currentFields };
  }

  // 2. Правило: Имя пользователя должно состоять как минимум из 4 символов
  if (username.trim().length < 4) {
    return { error: 'Username must be at least 4 characters long', fields: currentFields };
  }

  // 3. Правило: Пароль должен состоять как минимум из 4 символов
  if (password.length < 4) {
    return { error: 'Password must be at least 4 characters long', fields: currentFields };
  }

  // 4. Правило: Значение поля passwordConfirm должно совпадать с полем password
  if (password !== passwordConfirm) {
    return { error: 'Passwords do not match', fields: currentFields };
  }

  try {
    // 5. Правило: Если пользователь с указанным именем уже существует — возвращаем ошибку
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      return { error: 'Username is already taken', fields: currentFields };
    }

    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Вставляем нового пользователя в базу данных PostgreSQL
    await db.insert(users).values({
      username,
      name,
      passwordHash,
    });
  } catch (dbError) {
    console.error('Registration failed:', dbError);
    return { error: 'Registration failed due to a database error.', fields: currentFields };
  }

  // После успешной регистрации перенаправляем на страницу логина
  redirect('/login');
}
