// app/blogs/readingListActions.ts
'use server';

import { auth } from '../../auth';
import { db } from '../db';
import { readingList } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addToReadingList(blogId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    // ✅ Проверяем, используя правильные типы
    const [existing] = await db
      .select()
      .from(readingList)
      .where(
        and(
          eq(readingList.userId, session.user.id),
          eq(readingList.blogId, blogId)
        )
      )
      .limit(1);

    if (existing) {
      return { success: false, error: 'Blog already in reading list' };
    }

    await db.insert(readingList).values({
      userId: session.user.id,
      blogId: blogId,
    });

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath('/reading-list');

    return { success: true, message: 'Added to reading list!' };
  } catch (error) {
    console.error('Error adding to reading list:', error);
    return { success: false, error: 'Failed to add to reading list' };
  }
}

export async function removeFromReadingList(blogId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    await db
      .delete(readingList)
      .where(
        and(
          eq(readingList.userId, session.user.id),
          eq(readingList.blogId, blogId)
        )
      );

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath('/reading-list');

    return { success: true, message: 'Removed from reading list' };
  } catch (error) {
    console.error('Error removing from reading list:', error);
    return { success: false, error: 'Failed to remove from reading list' };
  }
}

export async function markAsRead(blogId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    await db
      .update(readingList)
      .set({ isRead: true })
      .where(
        and(
          eq(readingList.userId, session.user.id),
          eq(readingList.blogId, blogId)
        )
      );

    revalidatePath(`/blogs/${blogId}`);
    revalidatePath('/reading-list');

    return { success: true, message: 'Marked as read!' };
  } catch (error) {
    console.error('Error marking as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function isInReadingList(blogId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  try {
    const [result] = await db
      .select()
      .from(readingList)
      .where(
        and(
          eq(readingList.userId, session.user.id),
          eq(readingList.blogId, blogId)
        )
      )
      .limit(1);

    return !!result;
  } catch (error) {
    console.error('Error checking reading list:', error);
    return false;
  }
}