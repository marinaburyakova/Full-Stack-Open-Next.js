import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const blogs = pgTable('blogs', {
  // Используем UUID для уникальных ID блогов
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
  // По умолчанию у нового блога 0 лайков
  likes: integer('likes').default(0).notNull(),
});

// Экспортируем тип блога для использования в компонентах
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
