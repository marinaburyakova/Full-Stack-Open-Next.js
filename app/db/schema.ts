// app/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name'),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  apiToken: text('api_token'),
})

export const blogs = pgTable('blogs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url'),
  likes: integer('likes').default(0),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
})

// Таблица для списка чтения
export const readingList = pgTable('reading_list', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  blogId: integer('blog_id')
    .notNull()
    .references(() => blogs.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false),
})
