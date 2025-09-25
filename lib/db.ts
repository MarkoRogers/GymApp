import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is required')
}

const sql = neon(process.env.POSTGRES_URL)
export const db = drizzle(sql)

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  username: text('username'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Workout programs table  
export const workoutPrograms = pgTable('workout_programs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  difficultyLevel: integer('difficulty_level').notNull().default(1),
  durationWeeks: integer('duration_weeks').notNull().default(4),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export type SelectWorkoutProgram = typeof workoutPrograms.$inferSelect
export type InsertWorkoutProgram = typeof workoutPrograms.$inferInsert

export const insertWorkoutProgramSchema = createInsertSchema(workoutPrograms)

// Placeholder functions for your existing code
export async function deleteWorkoutProgram(id: number) {
  // Implementation would go here when you set up the database
  console.log(`Would delete workout program with id: ${id}`)
}
