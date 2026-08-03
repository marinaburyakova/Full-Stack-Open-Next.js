// app/blogs/actions.ts
'use server'; // Директива указывает, что это Server Action

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { blogsDb } from './data';

export async function createBlog(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const url = formData.get('url') as string;

  // Простейшая валидация
  if (!title || !author || !url) {
    // throw new Error('All fields are required');
  }

  // Добавляем новый объект в массив
  blogsDb.push({
    id: Math.random().toString(),
    title,
    author,
    url,
    likes: 0
  });

  // Очищаем кэш для страницы /blogs, чтобы Next.js запросил свежие данные
  revalidatePath('/blogs');
  
  // Перенаправляем пользователя обратно
  redirect('/blogs');
}

export async function likeBlog(formData: FormData) {
  // Извлекаем id блога из скрытого поля формы
  const id = formData.get('id') as string;

  // Находим блог в массиве
  const blog = blogsDb.find((b) => b.id === id);

  if (blog) {
    // Увеличиваем количество лайков
    blog.likes += 1;
    
    // Сбрасываем кэш для этой конкретной страницы блога и для общего списка
    revalidatePath(`/blogs/${id}`);
    revalidatePath('/blogs');
  }
}