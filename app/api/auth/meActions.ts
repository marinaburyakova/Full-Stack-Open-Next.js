// app/api/auth/meActions.ts
'use server';

import { auth } from '../../../auth';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function generateApiToken(): Promise<void> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect('/login');
    }

    const apiToken = crypto.randomBytes(32).toString('hex');

    await db
      .update(users)
      .set({ apiToken })
      .where(eq(users.id, session.user.id));

    revalidatePath('/me');
  } catch (error) {
    console.error('Error generating API token:', error);
    // В server action мы не можем вернуть ошибку напрямую в form action
    // Поэтому используем redirect или throw
    throw new Error('Failed to generate token');
  }
}