import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  boolean,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { count, eq, ilike, desc, and } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Safe DB init
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  const client = neon(process.env.DATABASE_URL);
  db = drizzle(client);
} else {
  console.warn("⚠️ DATABASE_URL is not set. DB queries will be disabled.");
}

export { db };

// ---------------- User Profiles Table ----------------
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").unique().notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SelectUserProfile = typeof userProfiles.$inferSelect;
export const insertUserProfileSchema = createInsertSchema(userProfiles);

// ---------------- Exercises Table ----------------
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'strength', 'cardio', 'flexibility', 'sports'
  muscleGroups: text("muscle_groups").array(),
  equipment: text("equipment").array(),
  instructions: text("instructions"),
  difficultyLevel: integer("difficulty_level").default(1),
  createdBy: text("created_by"), // user_id for custom exercises
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectExercise = typeof exercises.$inferSelect;
export const insertExerciseSchema = createInsertSchema(exercises);

// ---------------- Workout Programs Table ----------------
export const workoutPrograms = pgTable("workout_programs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  durationWeeks: integer("duration_weeks"),
  difficultyLevel: integer("difficulty_level").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SelectWorkoutProgram = typeof workoutPrograms.$inferSelect;
export const insertWorkoutProgramSchema = createInsertSchema(workoutPrograms);

// ---------------- Program Exercises Table ----------------
export const programExercises = pgTable("program_exercises", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => workoutPrograms.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id),
  dayNumber: integer("day_number").notNull(),
  orderIndex: integer("order_index").notNull(),
  targetSets: integer("target_sets"),
  targetRepsMin: integer("target_reps_min"),
  targetRepsMax: integer("target_reps_max"),
  targetWeight: numeric("target_weight", { precision: 5, scale: 2 }),
  targetDuration: integer("target_duration"), // seconds
  restDuration: integer("rest_duration").default(60), // seconds
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectProgramExercise = typeof programExercises.$inferSelect;
export const insertProgramExerciseSchema = createInsertSchema(programExercises);

// ---------------- Workout Sessions Table ----------------
export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  programId: integer("program_id").references(() => workoutPrograms.id),
  sessionName: text("session_name"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  rating: integer("rating"), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectWorkoutSession = typeof workoutSessions.$inferSelect;
export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions);

// ---------------- Session Exercises Table ----------------
export const sessionExercises = pgTable("session_exercises", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id").references(() => exercises.id),
  orderIndex: integer("order_index").notNull(),
  completedSets: integer("completed_sets").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectSessionExercise = typeof sessionExercises.$inferSelect;
export const insertSessionExerciseSchema = createInsertSchema(sessionExercises);

// ---------------- Exercise Sets Table ----------------
export const exerciseSets = pgTable("exercise_sets", {
  id: serial("id").primaryKey(),
  sessionExerciseId: integer("session_exercise_id").references(() => sessionExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: numeric("weight", { precision: 5, scale: 2 }),
  duration: integer("duration"), // seconds
  distance: numeric("distance", { precision: 6, scale: 2 }), // km or miles
  restDuration: integer("rest_duration"), // seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

export type SelectExerciseSet = typeof exerciseSets.$inferSelect;
export const insertExerciseSetSchema = createInsertSchema(exerciseSets);

// ---------------- Body Measurements Table ----------------
export const bodyMeasurements = pgTable("body_measurements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  measurementDate: date("measurement_date").notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }),
  bodyFatPercentage: numeric("body_fat_percentage", { precision: 4, scale: 2 }),
  muscleMass: numeric("muscle_mass", { precision: 5, scale: 2 }),
  measurements: jsonb("measurements"), // Flexible measurements like chest, waist, etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectBodyMeasurement = typeof bodyMeasurements.$inferSelect;
export const insertBodyMeasurementSchema = createInsertSchema(bodyMeasurements);

// ---------------- Progress Photos Table ----------------
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  photoUrl: text("photo_url").notNull(),
  photoDate: date("photo_date").notNull(),
  category: text("category"), // 'front', 'side', 'back', 'specific'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectProgressPhoto = typeof progressPhotos.$inferSelect;
export const insertProgressPhotoSchema = createInsertSchema(progressPhotos);

// ---------------- User Goals Table ----------------
export const userGoals = pgTable("user_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"), // 'weight_loss', 'muscle_gain', 'strength', 'endurance', 'custom'
  targetValue: numeric("target_value", { precision: 8, scale: 2 }),
  targetUnit: text("target_unit"),
  targetDate: date("target_date"),
  currentValue: numeric("current_value", { precision: 8, scale: 2 }).default("0"),
  isAchieved: boolean("is_achieved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  achievedAt: timestamp("achieved_at"),
});

export type SelectUserGoal = typeof userGoals.$inferSelect;
export const insertUserGoalSchema = createInsertSchema(userGoals);

// ---------------- Personal Records Table ----------------
export const personalRecords = pgTable("personal_records", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id),
  recordType: text("record_type").notNull(), // 'max_weight', 'max_reps', 'max_duration', 'max_distance'
  value: numeric("value", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit"),
  achievedDate: date("achieved_date").notNull(),
  sessionId: integer("session_id").references(() => workoutSessions.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectPersonalRecord = typeof personalRecords.$inferSelect;
export const insertPersonalRecordSchema = createInsertSchema(personalRecords);

// ---------------- User Achievements Table ----------------
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  achievementType: text("achievement_type").notNull(), // 'streak', 'milestone', 'pr', 'consistency'
  title: text("title").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  earnedDate: timestamp("earned_date").defaultNow(),
  points: integer("points").default(0),
});

export type SelectUserAchievement = typeof userAchievements.$inferSelect;
export const insertUserAchievementSchema = createInsertSchema(userAchievements);

// ---------------- Helper Functions ----------------

// Get user's workout programs
export async function getUserWorkoutPrograms(userId: string) {
  if (!db) return [];
  return db
    .select()
    .from(workoutPrograms)
    .where(eq(workoutPrograms.userId, userId))
    .orderBy(desc(workoutPrograms.createdAt));
}

// Get recent workout sessions for a user
export async function getRecentWorkoutSessions(userId: string, limit = 10) {
  if (!db) return [];
  return db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt))
    .limit(limit);
}

// Get exercises with optional filtering
export async function getExercises(
  search?: string,
  category?: string,
  createdBy?: string
) {
  if (!db) return [];
  
  let query = db.select().from(exercises);
  
  const conditions = [];
  
  if (search) {
    conditions.push(ilike(exercises.name, `%${search}%`));
  }
  
  if (category) {
    conditions.push(eq(exercises.category, category));
  }
  
  if (createdBy) {
    conditions.push(eq(exercises.createdBy, createdBy));
  } else {
    // Show public exercises if no specific creator
    conditions.push(eq(exercises.isPublic, true));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }
  
  return query.orderBy(exercises.name);
}

// Get user's body measurements
export async function getUserBodyMeasurements(userId: string, limit = 10) {
  if (!db) return [];
  return db
    .select()
    .from(bodyMeasurements)
    .where(eq(bodyMeasurements.userId, userId))
    .orderBy(desc(bodyMeasurements.measurementDate))
    .limit(limit);
}

// Get user's personal records
export async function getUserPersonalRecords(userId: string) {
  if (!db) return [];
  return db
    .select()
    .from(personalRecords)
    .where(eq(personalRecords.userId, userId))
    .orderBy(desc(personalRecords.achievedDate));
}

// Get user profile or create if doesn't exist
export async function getUserProfile(userId: string) {
  if (!db) return null;
  
  let profile = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
    
  if (profile.length === 0) {
    // Create new profile
    await db.insert(userProfiles).values({
      userId: userId,
      displayName: null,
      bio: null,
    });
    
    profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
  }
  
  return profile[0] || null;
}

// Delete workout program and all related data
export async function deleteWorkoutProgram(programId: number) {
  if (!db) return;
  await db.delete(workoutPrograms).where(eq(workoutPrograms.id, programId));
}

// Insert some default exercises (you can run this once)
export async function insertDefaultExercises() {
  if (!db) return;
  
  const defaultExercises = [
    {
      name: "Push-ups",
      category: "strength",
      muscleGroups: ["chest", "shoulders", "triceps"],
      equipment: ["bodyweight"],
      instructions: "Start in plank position, lower body to ground, push back up.",
      difficultyLevel: 2,
      isPublic: true,
    },
    {
      name: "Squats",
      category: "strength", 
      muscleGroups: ["quadriceps", "glutes", "hamstrings"],
      equipment: ["bodyweight"],
      instructions: "Stand with feet shoulder-width apart, lower hips back and down, return to standing.",
      difficultyLevel: 2,
      isPublic: true,
    },
    {
      name: "Running",
      category: "cardio",
      muscleGroups: ["legs", "cardiovascular"],
      equipment: ["none"],
      instructions: "Run at a steady pace for the specified duration.",
      difficultyLevel: 2,
      isPublic: true,
    },
    {
      name: "Bench Press",
      category: "strength",
      muscleGroups: ["chest", "shoulders", "triceps"],
      equipment: ["barbell", "bench"],
      instructions: "Lie on bench, lower bar to chest, press up to arms extended.",
      difficultyLevel: 3,
      isPublic: true,
    }
  ];
  
  // Insert only if exercises table is empty
  const existingCount = await db.select({ count: count() }).from(exercises);
  if (existingCount[0].count === 0) {
    await db.insert(exercises).values(defaultExercises);
  }
}
