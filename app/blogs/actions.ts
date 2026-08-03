// app/blogs/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { blogs } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

// Действие для создания блога
export async function createBlog(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const url = formData.get('url') as string;

  if (!title || !author || !url) {
    throw new Error('All fields are required');
  }

  // Вставляем запись в PostgreSQL через Drizzle
  await db.insert(blogs).values({
    title,
    author,
    url,
  });

  revalidatePath('/blogs');
  redirect('/blogs');
}

// Действие для лайка блога
export async function likeBlog(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) return;

  // Атомарно увеличиваем количество лайков на 1 в БД
  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id));

  revalidatePath(`/blogs/${id}`);
  revalidatePath('/blogs');
}
