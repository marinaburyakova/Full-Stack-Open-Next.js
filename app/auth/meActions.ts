// app/auth/meActions.ts
'use server';

import { auth, signOut } from '@/auth';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Действие для генерации случайного API-токена
 */
export async function generateApiToken() {
  const session = await auth();
  
  // Проверяем, авторизован ли пользователь
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Генерируем случайную UUID строку
  const newToken = crypto.randomUUID();

  // Сохраняем токен в базу данных для текущего пользователя
  await db
    .update(users)
    .set({ apiToken: newToken })
    .where(eq(users.id, session.user.id));

  // Сбрасываем кэш страницы /me, чтобы отобразить новый токен
  revalidatePath('/me');
}

/**
 * Действие для выхода из системы (LOGOUT)
 */
export async function logoutUser() {
  await signOut({ redirectTo: '/login' });
}
