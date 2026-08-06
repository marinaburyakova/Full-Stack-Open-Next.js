// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../db'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'

export async function POST(request: Request) {
  try {
    const { name, username, password } = await request.json()

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      )
    }

    // Для тестов используем схему test
    if (process.env.NODE_ENV === 'test') {
      await db.execute(sql`SET search_path TO test`)
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.insert(users).values({
      name,
      username,
      passwordHash,
    })

    // Возвращаемся на public
    if (process.env.NODE_ENV === 'test') {
      await db.execute(sql`SET search_path TO public`)
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
