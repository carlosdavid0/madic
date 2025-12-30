import { relations } from 'drizzle-orm';
import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { files } from './file';
import { users } from './users';

export const challenges = pgTable(
  'challenges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    thumbnailFileId: uuid('thumbnail_file_id').references(() => files.id, { onDelete: 'set null' }),
    participationStartDate: timestamp('participation_start_date'),
    participationEndDate: timestamp('participation_end_date'),
    votingStartDate: timestamp('voting_start_date'),
    votingEndDate: timestamp('voting_end_date'),
    firstPlacePoints: integer('first_place_points').notNull().default(100),
    secondPlacePoints: integer('second_place_points').notNull().default(75),
    thirdPlacePoints: integer('third_place_points').notNull().default(50),
    otherPlacesPoints: integer('other_places_points').notNull().default(25),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [index('challenges_created_at_idx').on(table.createdAt)]
);

export const challengeFiles = pgTable(
  'challenge_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    fileId: uuid('file_id')
      .notNull()
      .references(() => files.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('challenge_files_challenge_idx').on(table.challengeId),
    index('challenge_files_file_idx').on(table.fileId),
  ]
);

export const challengeUsers = pgTable(
  'challenge_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    position: integer('position'),
    pointsEarned: integer('points_earned'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('unique_challenge_user').on(table.challengeId, table.userId),
    index('challenge_users_challenge_idx').on(table.challengeId),
    index('challenge_users_user_idx').on(table.userId),
  ]
);

export const challengeUserFiles = pgTable(
  'challenge_user_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    fileId: uuid('file_id')
      .notNull()
      .references(() => files.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('challenge_user_files_challenge_idx').on(table.challengeId),
    index('challenge_user_files_user_idx').on(table.userId),
    index('challenge_user_files_file_idx').on(table.fileId),
  ]
);

export const userPoints = pgTable(
  'user_points',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    points: integer('points').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('unique_user_challenge_points').on(table.userId, table.challengeId),
    index('user_points_user_idx').on(table.userId),
    index('user_points_challenge_idx').on(table.challengeId),
  ]
);

export const challengeSubmissions = pgTable(
  'challenge_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    isFeatured: integer('is_featured').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('unique_challenge_user_submission').on(table.challengeId, table.userId),
    index('challenge_submissions_challenge_idx').on(table.challengeId),
    index('challenge_submissions_user_idx').on(table.userId),
    index('challenge_submissions_featured_idx').on(table.isFeatured),
  ]
);

export const challengeSubmissionFiles = pgTable(
  'challenge_submission_files',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => challengeSubmissions.id, { onDelete: 'cascade' }),
    fileId: uuid('file_id')
      .notNull()
      .references(() => files.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    index('challenge_submission_files_submission_idx').on(table.submissionId),
    index('challenge_submission_files_file_idx').on(table.fileId),
  ]
);

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  participants: many(challengeUsers),
  challengeFiles: many(challengeFiles),
  userFiles: many(challengeUserFiles),
  userPoints: many(userPoints),
  submissions: many(challengeSubmissions),
  thumbnailFile: one(files, {
    fields: [challenges.thumbnailFileId],
    references: [files.id],
  }),
}));

export const challengeFilesRelations = relations(challengeFiles, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeFiles.challengeId],
    references: [challenges.id],
  }),
  file: one(files, {
    fields: [challengeFiles.fileId],
    references: [files.id],
  }),
}));

export const challengeUsersRelations = relations(challengeUsers, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeUsers.challengeId],
    references: [challenges.id],
  }),
  user: one(users, {
    fields: [challengeUsers.userId],
    references: [users.id],
  }),
}));

export const challengeUserFilesRelations = relations(
  challengeUserFiles,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeUserFiles.challengeId],
      references: [challenges.id],
    }),
    user: one(users, {
      fields: [challengeUserFiles.userId],
      references: [users.id],
    }),
    file: one(files, {
      fields: [challengeUserFiles.fileId],
      references: [files.id],
    }),
  })
);

export const userPointsRelations = relations(userPoints, ({ one }) => ({
  user: one(users, {
    fields: [userPoints.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userPoints.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeSubmissionsRelations = relations(
  challengeSubmissions,
  ({ one, many }) => ({
    challenge: one(challenges, {
      fields: [challengeSubmissions.challengeId],
      references: [challenges.id],
    }),
    user: one(users, {
      fields: [challengeSubmissions.userId],
      references: [users.id],
    }),
    files: many(challengeSubmissionFiles),
  })
);

export const challengeSubmissionFilesRelations = relations(
  challengeSubmissionFiles,
  ({ one }) => ({
    submission: one(challengeSubmissions, {
      fields: [challengeSubmissionFiles.submissionId],
      references: [challengeSubmissions.id],
    }),
    file: one(files, {
      fields: [challengeSubmissionFiles.fileId],
      references: [files.id],
    }),
  })
);

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;

export type ChallengeFile = typeof challengeFiles.$inferSelect;
export type NewChallengeFile = typeof challengeFiles.$inferInsert;

export type ChallengeUser = typeof challengeUsers.$inferSelect;
export type NewChallengeUser = typeof challengeUsers.$inferInsert;

export type ChallengeUserFile = typeof challengeUserFiles.$inferSelect;
export type NewChallengeUserFile = typeof challengeUserFiles.$inferInsert;

export type UserPoints = typeof userPoints.$inferSelect;
export type NewUserPoints = typeof userPoints.$inferInsert;

export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type NewChallengeSubmission = typeof challengeSubmissions.$inferInsert;

export type ChallengeSubmissionFile = typeof challengeSubmissionFiles.$inferSelect;
export type NewChallengeSubmissionFile = typeof challengeSubmissionFiles.$inferInsert;