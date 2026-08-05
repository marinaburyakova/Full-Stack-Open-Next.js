// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db'; // Изменен путь с '@/app/db' на '../../db'
import { users } from '../../../db/schema'; // Изменен путь
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, username, password } = await request.json();

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
        name,
        username,
        passwordHash,
      })
      .returning();

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: { 
          id: newUser.id, 
          name: newUser.name, 
          username: newUser.username 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}