import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const tools = pgTable('tools', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userTools = pgTable(
  'user_tools',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    toolsId: uuid('tools_id')
      .notNull()
      .references(() => tools.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('unique_user_tool').on(table.userId, table.toolsId),
    index('user_tools_user_idx').on(table.userId),
    index('user_tools_tool_idx').on(table.toolsId),
  ]
);

export const toolsRelations = relations(tools, ({ many }) => ({
  users: many(userTools),
}));

export const userToolsRelations = relations(userTools, ({ one }) => ({
  user: one(users, {
    fields: [userTools.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [userTools.toolsId],
    references: [tools.id],
  }),
}));

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
export type UserTool = typeof userTools.$inferSelect;
export type NewUserTool = typeof userTools.$inferInsert;

