CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  identifiers TEXT[] NOT NULL,
  country VARCHAR(100) NOT NULL,
  total_score INTEGER DEFAULT 0,
  reputation VARCHAR(20) DEFAULT 'UNKNOWN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  text TEXT NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pseudo_author VARCHAR(100),
  confirmations INTEGER DEFAULT 0,
  evidence_url TEXT,
  reviewer_contact_info JSONB -- Store email, phone, instagram separately but securely
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  contribution_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_identifiers ON profiles USING GIN(identifiers);
CREATE INDEX IF NOT EXISTS idx_reviews_profile_id ON reviews(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date);
