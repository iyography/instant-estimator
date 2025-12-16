-- Instant Estimator Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE industry_type AS ENUM (
  'electrician', 'plumber', 'hvac', 'general_contractor',
  'painter', 'landscaper', 'roofing', 'cleaning', 'other'
);

CREATE TYPE currency_type AS ENUM ('SEK', 'EUR', 'USD');

CREATE TYPE language_type AS ENUM ('sv', 'en');

CREATE TYPE subscription_status_type AS ENUM (
  'trial', 'active', 'past_due', 'canceled', 'inactive'
);

CREATE TYPE question_type AS ENUM (
  'multiple_choice', 'single_choice', 'number_input', 'text_input'
);

CREATE TYPE price_modifier_type AS ENUM (
  'fixed_add', 'fixed_subtract', 'percentage_add', 'percentage_subtract', 'multiply'
);

CREATE TYPE lead_status_type AS ENUM (
  'new', 'contacted', 'quoted', 'won', 'lost'
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website_url VARCHAR(500),
  industry industry_type NOT NULL DEFAULT 'other',
  default_currency currency_type NOT NULL DEFAULT 'SEK',
  default_language language_type NOT NULL DEFAULT 'sv',
  stripe_customer_id VARCHAR(255),
  subscription_status subscription_status_type NOT NULL DEFAULT 'trial',
  settings JSONB NOT NULL DEFAULT '{}',
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job Types table
CREATE TABLE job_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_sv VARCHAR(255),
  description TEXT,
  description_sv TEXT,
  base_price INTEGER NOT NULL DEFAULT 0, -- stored in smallest currency unit
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type_id UUID REFERENCES job_types(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_text_sv TEXT,
  question_type question_type NOT NULL DEFAULT 'single_choice',
  is_required BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Answer Options table
CREATE TABLE answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  answer_text_sv TEXT,
  price_modifier_type price_modifier_type NOT NULL DEFAULT 'fixed_add',
  price_modifier_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estimator Forms table
CREATE TABLE estimator_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  styling JSONB NOT NULL DEFAULT '{}',
  job_type_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, slug)
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  job_type_id UUID REFERENCES job_types(id) ON DELETE SET NULL,
  form_id UUID REFERENCES estimator_forms(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  estimated_price_low INTEGER NOT NULL DEFAULT 0,
  estimated_price_high INTEGER NOT NULL DEFAULT 0,
  status lead_status_type NOT NULL DEFAULT 'new',
  notes TEXT,
  source_url VARCHAR(1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead Responses table
CREATE TABLE lead_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  answer_option_id UUID REFERENCES answer_options(id) ON DELETE SET NULL,
  raw_answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_job_types_company_id ON job_types(company_id);
CREATE INDEX idx_questions_job_type_id ON questions(job_type_id);
CREATE INDEX idx_answer_options_question_id ON answer_options(question_id);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_responses_lead_id ON lead_responses(lead_id);
CREATE INDEX idx_estimator_forms_company_id ON estimator_forms(company_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_types_updated_at
  BEFORE UPDATE ON job_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answer_options_updated_at
  BEFORE UPDATE ON answer_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimator_forms_updated_at
  BEFORE UPDATE ON estimator_forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimator_forms ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only see/modify their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own company" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Job Types: Users can manage job types for their company
CREATE POLICY "Users can view own job types" ON job_types
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert job types for own company" ON job_types
  FOR INSERT WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own job types" ON job_types
  FOR UPDATE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own job types" ON job_types
  FOR DELETE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Public access to active job types for estimator widget
CREATE POLICY "Public can view active job types" ON job_types
  FOR SELECT USING (is_active = true);

-- Questions: Users can manage questions for their job types
CREATE POLICY "Users can view own questions" ON questions
  FOR SELECT USING (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for own job types" ON questions
  FOR INSERT WITH CHECK (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own questions" ON questions
  FOR UPDATE USING (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own questions" ON questions
  FOR DELETE USING (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

-- Public access to questions for active job types
CREATE POLICY "Public can view questions for active job types" ON questions
  FOR SELECT USING (
    job_type_id IN (SELECT id FROM job_types WHERE is_active = true)
  );

-- Answer Options: Similar pattern
CREATE POLICY "Users can view own answer options" ON answer_options
  FOR SELECT USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON jt.id = q.job_type_id
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answer options" ON answer_options
  FOR INSERT WITH CHECK (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON jt.id = q.job_type_id
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own answer options" ON answer_options
  FOR UPDATE USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON jt.id = q.job_type_id
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own answer options" ON answer_options
  FOR DELETE USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON jt.id = q.job_type_id
      JOIN companies c ON c.id = jt.company_id
      WHERE c.user_id = auth.uid()
    )
  );

-- Public access to answer options for active job types
CREATE POLICY "Public can view answer options for active job types" ON answer_options
  FOR SELECT USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON jt.id = q.job_type_id
      WHERE jt.is_active = true
    )
  );

-- Leads: Users can manage their own leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Lead Responses: Similar to leads
CREATE POLICY "Users can view own lead responses" ON lead_responses
  FOR SELECT USING (
    lead_id IN (
      SELECT l.id FROM leads l
      JOIN companies c ON c.id = l.company_id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert lead responses" ON lead_responses
  FOR INSERT WITH CHECK (true);

-- Estimator Forms
CREATE POLICY "Users can view own forms" ON estimator_forms
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert forms" ON estimator_forms
  FOR INSERT WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own forms" ON estimator_forms
  FOR UPDATE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own forms" ON estimator_forms
  FOR DELETE USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Public access to active forms
CREATE POLICY "Public can view active forms" ON estimator_forms
  FOR SELECT USING (is_active = true);

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Convert to lowercase and replace spaces with hyphens
  slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'));
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := regexp_replace(slug, '^-|-$', '', 'g');

  -- Check if slug exists and append counter if needed
  LOOP
    IF counter > 0 THEN
      slug := slug || '-' || counter;
    END IF;

    EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name)
    INTO slug_exists
    USING slug;

    IF NOT slug_exists THEN
      RETURN slug;
    END IF;

    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
