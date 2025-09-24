-- Users table (extends existing auth)
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- From NextAuth
  display_name TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exercise library
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'strength', 'cardio', 'flexibility', 'sports'
  muscle_groups TEXT[], -- Array of muscle groups
  equipment TEXT[], -- Array of required equipment
  instructions TEXT,
  difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
  created_by TEXT, -- user_id for custom exercises
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout programs
CREATE TABLE workout_programs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER,
  difficulty_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Program exercises (exercises within a program)
CREATE TABLE program_exercises (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES workout_programs(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  day_number INTEGER NOT NULL, -- Which day in the program
  order_index INTEGER NOT NULL, -- Order within the day
  target_sets INTEGER,
  target_reps_min INTEGER,
  target_reps_max INTEGER,
  target_weight DECIMAL(5,2),
  target_duration INTEGER, -- seconds
  rest_duration INTEGER DEFAULT 60, -- seconds
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout sessions
CREATE TABLE workout_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  program_id INTEGER REFERENCES workout_programs(id),
  session_name TEXT,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session exercises (logged exercises)
CREATE TABLE session_exercises (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id),
  order_index INTEGER NOT NULL,
  completed_sets INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Individual sets within session exercises
CREATE TABLE exercise_sets (
  id SERIAL PRIMARY KEY,
  session_exercise_id INTEGER REFERENCES session_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(5,2),
  duration INTEGER, -- seconds
  distance DECIMAL(6,2), -- km or miles
  rest_duration INTEGER, -- seconds
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Body measurements
CREATE TABLE body_measurements (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  measurement_date DATE NOT NULL,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  measurements JSONB, -- Flexible measurements like chest, waist, etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress photos
CREATE TABLE progress_photos (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  photo_date DATE NOT NULL,
  category TEXT, -- 'front', 'side', 'back', 'specific'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User goals
CREATE TABLE user_goals (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'weight_loss', 'muscle_gain', 'strength', 'endurance', 'custom'
  target_value DECIMAL(8,2),
  target_unit TEXT,
  target_date DATE,
  current_value DECIMAL(8,2) DEFAULT 0,
  is_achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  achieved_at TIMESTAMP
);

-- Personal records
CREATE TABLE personal_records (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_id INTEGER REFERENCES exercises(id),
  record_type TEXT NOT NULL, -- 'max_weight', 'max_reps', 'max_duration', 'max_distance'
  value DECIMAL(8,2) NOT NULL,
  unit TEXT,
  achieved_date DATE NOT NULL,
  session_id INTEGER REFERENCES workout_sessions(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements/badges
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_type TEXT NOT NULL, -- 'streak', 'milestone', 'pr', 'consistency'
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  earned_date TIMESTAMP DEFAULT NOW(),
  points INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_program_exercises_program_id ON program_exercises(program_id);
CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_body_measurements_user_date ON body_measurements(user_id, measurement_date);
CREATE INDEX idx_personal_records_user_exercise ON personal_records(user_id, exercise_id);
