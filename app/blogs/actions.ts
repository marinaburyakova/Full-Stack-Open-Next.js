// app/blogs/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { blogs } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

// Описываем тип состояния для хука useActionState
export interface ActionState {
  error?: string;
  fields?: {
    title: string;
    author: string;
    url: string;
  };
}

/**
 * Серверное действие для создания нового блога с валидацией полей
 * @param prevState — предыдущее состояние формы (требуется дляuseActionState)
 * @param formData — объект данных формы
 */
export async function createBlog(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const url = formData.get('url') as string;

  // Формируем объект текущих полей, чтобы вернуть их в случае ошибки
  const currentFields = { title, author, url };

  // Правило: Все поля должны быть указаны и иметь минимальную длину 5 символов
  if (!title || title.trim().length < 5) {
    return { 
      error: 'Title must be at least 5 characters long', 
      fields: currentFields 
    };
  }
  if (!author || author.trim().length < 5) {
    return { 
      error: 'Author must be at least 5 characters long', 
      fields: currentFields 
    };
  }
  if (!url || url.trim().length < 5) {
    return { 
      error: 'URL must be at least 5 characters long', 
      fields: currentFields 
    };
  }

  try {
    // Вставляем запись в PostgreSQL через Drizzle
    await db.insert(blogs).values({
      title,
      author,
      url,
    });
  } catch (dbError) {
    console.error('Failed to create blog in DB:', dbError);
    return { 
      error: 'Database saving failed. Try again.', 
      fields: currentFields 
    };
  }

  // Если всё успешно, сбрасываем кэш и перенаправляем пользователя
  revalidatePath('/blogs');
  redirect('/blogs');
}

/**
 * Серверное действие для увеличения количества лайков на единицу
 * @param formData — объект данных формы (содержит hidden-поле id)
 */
export async function likeBlog(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) return;

  try {
    // Атомарно увеличиваем количество лайков на 1 в БД
    await db
      .update(blogs)
      .set({ likes: sql`${blogs.likes} + 1` })
      .where(eq(blogs.id, id));

    // Сбрасываем кэш для детальной страницы и общего списка блогов
    revalidatePath(`/blogs/${id}`);
    revalidatePath('/blogs');
  } catch (error) {
    console.error('Failed to update likes in DB:', error);
  }
}
