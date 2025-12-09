import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { skills } from './skills';
import { userSocial } from './social';
import { userTools } from './tools';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  avatar: varchar('avatar', { length: 255 }),
  socialName: varchar('social_name', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailValidated: boolean('email_validated').default(false),
  password: varchar('password', { length: 255 }).notNull(),
  bio: text('bio'),
  age: date('age'),
  locate: text('locate'),
  availableFreelancer: boolean('available_freelancer').default(false),
  active: boolean('active').default(true),
  profileCompleted: boolean('profile_completed').default(false),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  tools: many(userTools),
  socialMedias: many(userSocial),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

