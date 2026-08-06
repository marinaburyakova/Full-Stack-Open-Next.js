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
    console.log('🔄 Resetting test database...');

    // ✅ ПЕРЕКЛЮЧАЕМСЯ НА СХЕМУ TEST
    await db.execute(sql`SET search_path TO test`);

    // ✅ УДАЛЯЕМ ДАННЫЕ В ПРАВИЛЬНОМ ПОРЯДКЕ
    await db.execute(sql`DELETE FROM "reading_list"`);
    await db.execute(sql`DELETE FROM "blogs"`);
    await db.execute(sql`DELETE FROM "users"`);

    // ✅ СБРАСЫВАЕМ СЧЕТЧИКИ
    await db.execute(sql`ALTER SEQUENCE "reading_list_id_seq" RESTART WITH 1`);

    // ✅ ВОЗВРАЩАЕМСЯ НА PUBLIC
    await db.execute(sql`SET search_path TO public`);

    console.log('✅ Test database reset successfully');

    return NextResponse.json(
      { 
        success: true, 
        message: 'All test data has been reset successfully',
        schema: 'test'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}