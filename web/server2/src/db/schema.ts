import { integer, pgTable, varchar, text, index, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  userId: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const problemsTable = pgTable("problems", {
  problemId: integer().primaryKey().generatedAlwaysAsIdentity(),
  problemDesc: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const solutionsTable = pgTable("solutions", {
  solutionId: integer().primaryKey().generatedAlwaysAsIdentity(),
  problemId: integer().references(() => problemsTable.problemId),
  userId: integer().references(() => usersTable.userId),
  solutionContent: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("user_problem_index").on(table.problemId, table.userId)
])
