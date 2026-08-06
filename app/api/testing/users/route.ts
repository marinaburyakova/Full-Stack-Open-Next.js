// app/api/testing/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }

  try {
    // ✅ ПЕРЕКЛЮЧАЕМСЯ НА СХЕМУ TEST
    await db.execute(sql`SET search_path TO test`);

    const body = await request.json();
    const { username, name, password } = body;

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: 'Username, name, and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Проверяем существующего пользователя в схеме TEST
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        username,
        name,
        passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
        name: users.name,
      });

    // ✅ ВОЗВРАЩАЕМСЯ НА PUBLIC
    await db.execute(sql`SET search_path TO public`);

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully in test schema',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}