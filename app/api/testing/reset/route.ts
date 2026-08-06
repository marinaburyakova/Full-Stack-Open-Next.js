// app/api/testing/reset/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { sql } from 'drizzle-orm';

export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }

  try {
    // ✅ Переключаемся на схему test
    await db.execute(sql`SET search_path TO test`);
    
    // Удаляем данные
    await db.execute(sql`DELETE FROM "reading_list"`);
    await db.execute(sql`DELETE FROM "blogs"`);
    await db.execute(sql`DELETE FROM "users"`);

    // Сбрасываем счетчики
    await db.execute(sql`ALTER SEQUENCE "reading_list_id_seq" RESTART WITH 1`);

    // ✅ Возвращаемся на public
    await db.execute(sql`SET search_path TO public`);

    return NextResponse.json(
      { 
        success: true, 
        message: 'All test data has been reset successfully',
        schema: 'test'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}