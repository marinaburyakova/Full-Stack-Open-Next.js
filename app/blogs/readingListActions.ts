// app/blogs/readingListActions.ts
'use server';

import { auth } from '../../auth';
import { db } from '../db';
import { readingList } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ✅ blogId - UUID как строка
export async function addToReadingList(blogId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  try {
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

// ✅ Остальные функции аналогично с blogId: string
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