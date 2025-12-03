import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const socialMedias = pgTable('social_medias', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userSocial = pgTable(
  'user_social',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    socialId: uuid('social_id')
      .notNull()
      .references(() => socialMedias.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('unique_user_social').on(table.userId, table.socialId),
    index('user_social_user_idx').on(table.userId),
    index('user_social_social_idx').on(table.socialId),
  ]
);

export const socialMediasRelations = relations(socialMedias, ({ many }) => ({
  users: many(userSocial),
}));

export const userSocialRelations = relations(userSocial, ({ one }) => ({
  user: one(users, {
    fields: [userSocial.userId],
    references: [users.id],
  }),
  social: one(socialMedias, {
    fields: [userSocial.socialId],
    references: [socialMedias.id],
  }),
}));

export type SocialMedia = typeof socialMedias.$inferSelect;
export type NewSocialMedia = typeof socialMedias.$inferInsert;
export type UserSocial = typeof userSocial.$inferSelect;
export type NewUserSocial = typeof userSocial.$inferInsert;

