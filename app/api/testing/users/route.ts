// app/api/testing/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Защита: запрещаем в продакшене
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }

  try {
    // Парсим тело запроса
    const body = await request.json();
    const { username, name, password } = body;

    // Валидация
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

    // Проверяем, существует ли пользователь в TEST схеме
    const existingUser = await db.execute(
      sql`SELECT id FROM test.users WHERE username = ${username} LIMIT 1`
    );

    // ✅ Исправлено: проверяем через Array.isArray и длину
    if (existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Вставляем напрямую в схему test с RETURNING
    const result = await db.execute(
      sql`
        INSERT INTO test.users (name, username, password_hash)
        VALUES (${name}, ${username}, ${passwordHash})
        RETURNING id, username, name
      `
    );

    // ✅ Исправлено: получаем первый элемент из результата
    const newUser = result && Array.isArray(result) && result.length > 0 ? result[0] : null;

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    console.log('✅ User created in test schema:', newUser);

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
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}