// app/api/testing/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../db'
import { sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 },
    )
  }

  try {
    const body = await request.json()
    const { username, name, password } = body

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: 'Username, name, and password are required' },
        { status: 400 },
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 },
      )
    }

    // ✅ Проверяем существование пользователя
    const existing = await db.execute(
      sql`SELECT id FROM test.users WHERE username = ${username} LIMIT 1`,
    )

    if (existing && Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await db.execute(
      sql`
        INSERT INTO test.users (name, username, password_hash)
        VALUES (${name}, ${username}, ${passwordHash})
        RETURNING id, username, name
      `,
    )

    const newUser =
      result && Array.isArray(result) && result.length > 0 ? result[0] : null

    if (!newUser) {
      throw new Error('Failed to create user')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('❌ Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    )
  }
}
