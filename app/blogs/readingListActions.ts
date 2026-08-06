// app/blogs/readingListActions.ts
'use server';

import { auth } from '../../auth';
import { db } from '../db';
import { readingList } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ✅ Меняем тип с number на string (UUID)
export async function addToReadingList(blogId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
    // Проверяем, есть ли уже в списке
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

// ✅ Меняем тип с number на string (UUID)
export async function removeFromReadingList(blogId: string) {
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

// ✅ Меняем тип с number на string (UUID)
export async function markAsRead(blogId: string) {
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