// app/db/schema.ts
import { pgTable, uuid, text, varchar, integer } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name'),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  apiToken: text('api_token'),
  // Убираем createdAt, если его нет в базе данных
  // createdAt: timestamp('created_at').defaultNow(),
})

export const blogs = pgTable('blogs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url'),
  likes: integer('likes').default(0),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
})
