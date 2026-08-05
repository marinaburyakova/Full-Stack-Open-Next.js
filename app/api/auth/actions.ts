// app/auth/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { db } from '../../db';
import { users } from '../../db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  // Валидация наличия всех полей
  if (!username || !name || !password) {
    throw new Error('All fields are required');
  }

  // Проверяем, не занят ли username в базе данных
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existingUser) {
    throw new Error('Username is already taken');
  }

  // Хешируем пароль (10 раундов соли — стандарт безопасности)
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Сохраняем нового пользователя в PostgreSQL через Drizzle
  await db.insert(users).values({
    username,
    name,
    passwordHash,
  });

  // После успешной регистрации перенаправляем пользователя на логин
  redirect('/login');
}
