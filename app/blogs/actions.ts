// app/blogs/actions.ts
'use server'

import { auth } from '../../auth'
import { db } from '../db'
import { blogs } from '../db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sql } from 'drizzle-orm'

export type ActionState = {
  errors?: {
    title?: string[]
    author?: string[]
    url?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
}

function normalizeUrl(url: string): string | null {
  if (!url || url.trim().length === 0) return null
  let normalizedUrl = url.trim()
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`
  }
  try {
    new URL(normalizedUrl)
    return normalizedUrl
  } catch {
    return null
  }
}

export async function createBlog(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['You must be logged in to create a blog'],
      },
      success: false,
    }
  }

  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const url = formData.get('url') as string

  const errors: ActionState['errors'] = {}

  if (!title?.trim()) errors.title = ['Title is required']
  if (!author?.trim()) errors.author = ['Author is required']
  if (url?.trim()) {
    const normalizedUrl = normalizeUrl(url)
    if (!normalizedUrl) {
      errors.url = ['Please enter a valid URL']
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false }
  }

  try {
    const normalizedUrl = url ? normalizeUrl(url) : null

    await db.insert(blogs).values({
      title: title.trim(),
      author: author.trim(),
      url: normalizedUrl,
      userId: session.user.id,
    })

    revalidatePath('/blogs')

    // ✅ Редирект через return с success
    return {
      success: true,
      message: 'Blog created successfully!',
    }
  } catch (error) {
    console.error('Create blog error:', error)
    return {
      errors: {
        _form: ['Failed to create blog. Please try again.'],
      },
      success: false,
    }
  }
}

// Остальные функции (likeBlog, deleteBlog, updateBlog)...
export async function likeBlog(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const idString = formData.get('id') as string

  if (!idString) {
    throw new Error('Blog ID is required')
  }

  // ✅ Используем UUID как строку
  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, idString))

  revalidatePath(`/blogs/${idString}`)
  revalidatePath('/blogs')
}

export async function deleteBlog(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const idString = formData.get('id') as string

  if (!idString) {
    throw new Error('Blog ID is required')
  }

  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, idString))
    .limit(1)

  if (!blog) {
    throw new Error('Blog not found')
  }

  if (blog.userId !== session.user.id) {
    throw new Error('You are not authorized to delete this blog')
  }

  await db.delete(blogs).where(eq(blogs.id, idString))

  revalidatePath('/blogs')
  redirect('/blogs')
}

export async function updateBlog(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const idString = formData.get('id') as string
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const url = formData.get('url') as string

  if (!idString || !title || !author) {
    throw new Error('All fields are required')
  }

  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, idString))
    .limit(1)

  if (!blog) {
    throw new Error('Blog not found')
  }

  if (blog.userId !== session.user.id) {
    throw new Error('You are not authorized to update this blog')
  }

  const normalizedUrl = url ? normalizeUrl(url) : null

  await db
    .update(blogs)
    .set({
      title: title.trim(),
      author: author.trim(),
      url: normalizedUrl,
    })
    .where(eq(blogs.id, idString))

  revalidatePath(`/blogs/${idString}`)
  revalidatePath('/blogs')
  redirect(`/blogs/${idString}`)
}
