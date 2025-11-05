-- Supabase Tables for Kornu Application

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id BIGSERIAL PRIMARY KEY,
  identifiers TEXT[] DEFAULT '{}',
  country VARCHAR(100) NOT NULL,
  total_score INTEGER DEFAULT 0,
  reputation VARCHAR(20) DEFAULT 'UNKNOWN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pseudo_author VARCHAR(100),
  confirmations INTEGER DEFAULT 0,
  evidence_url TEXT,
  reviewer_contact_info JSONB
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  contribution_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_identifiers ON profiles USING GIN(identifiers);
CREATE INDEX IF NOT EXISTS idx_reviews_profile_id ON reviews(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your app's security model)
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users are viewable by authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated'); 
