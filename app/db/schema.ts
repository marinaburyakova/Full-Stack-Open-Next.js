// app/db/schema.ts
import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Создаем таблицу пользователей
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
});

// 2. Обновляем таблицу блогов (добавляем userId с внешним ключом)
export const blogs = pgTable('blogs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
  likes: integer('likes').default(0).notNull(),
  // Внешний ключ: при удалении пользователя его блоги каскадно удаляются (optional)
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
});

// 3. Описываем реляционные связи для Drizzle Queries (понадобится в будущем)
export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
}));

// Экспортируем типы
export type User = typeof users.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
