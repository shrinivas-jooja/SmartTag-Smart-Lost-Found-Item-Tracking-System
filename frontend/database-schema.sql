-- Create owners table
CREATE TABLE owners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_codes table
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  data TEXT, -- JSON or text data for the QR
  owner_id UUID REFERENCES owners(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on auth setup)
-- For owners: users can only see their own data
CREATE POLICY "Owners can view own data" ON owners FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Owners can insert own data" ON owners FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Owners can update own data" ON owners FOR UPDATE USING (auth.uid() = id);

-- Similar for members and qr_codes, scoped to owner_id