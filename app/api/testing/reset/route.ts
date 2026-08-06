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
    console.log('✅ Switched to test schema');

    // Удаляем данные в правильном порядке
    await db.execute(sql`DELETE FROM "reading_list"`);
    console.log('✅ Deleted reading_list');

    await db.execute(sql`DELETE FROM "blogs"`);
    console.log('✅ Deleted blogs');

    await db.execute(sql`DELETE FROM "users"`);
    console.log('✅ Deleted users');

    // Сбрасываем счетчики
    await db.execute(sql`ALTER SEQUENCE "reading_list_id_seq" RESTART WITH 1`);
    console.log('✅ Reset sequences');

    // ✅ ВОЗВРАЩАЕМСЯ НА PUBLIC
    await db.execute(sql`SET search_path TO public`);
    console.log('✅ Switched back to public schema');

    // ✅ ДОБАВЛЯЕМ ЗАДЕРЖКУ, ЧТОБЫ БАЗА УСПЕЛА ОБНОВИТЬСЯ
    await new Promise(resolve => setTimeout(resolve, 1000));

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