// app/api/testing/reset/route.ts
import { NextResponse } from 'next/server'
import { db } from '../../../db'
import { sql } from 'drizzle-orm'

export async function DELETE() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 },
    )
  }

  try {
    console.log('🔄 Resetting test database...')

    await db.execute(sql`DELETE FROM test.reading_list`)
    await db.execute(sql`DELETE FROM test.blogs`)
    await db.execute(sql`DELETE FROM test.users`)
    await db.execute(
      sql`ALTER SEQUENCE test.reading_list_id_seq RESTART WITH 1`,
    )

    console.log('✅ Test database reset successfully')

    return NextResponse.json(
      {
        success: true,
        message: 'All test data has been reset successfully',
        schema: 'test',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 },
    )
  }
}
