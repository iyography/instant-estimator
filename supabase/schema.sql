-- Instant Estimator Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE industry AS ENUM (
  'electrician', 'plumber', 'hvac', 'general_contractor',
  'painter', 'landscaper', 'roofing', 'cleaning', 'other'
);

CREATE TYPE currency AS ENUM ('SEK', 'EUR', 'USD');

CREATE TYPE language AS ENUM ('sv', 'en');

CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'inactive');

CREATE TYPE question_type AS ENUM ('multiple_choice', 'single_choice', 'number_input', 'text_input', 'quantity');

CREATE TYPE price_modifier_type AS ENUM (
  'fixed_add', 'fixed_subtract', 'percentage_add', 'percentage_subtract',
  'multiply', 'fixed', 'percentage', 'per_unit'
);

CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  website_url TEXT,
  industry industry NOT NULL DEFAULT 'other',
  default_currency currency NOT NULL DEFAULT 'USD',
  default_language language NOT NULL DEFAULT 'en',
  stripe_customer_id TEXT,
  subscription_status subscription_status NOT NULL DEFAULT 'trial',
  settings JSONB NOT NULL DEFAULT '{"estimate_range_low_percentage": 10, "estimate_range_high_percentage": 15}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job Types (Services)
CREATE TABLE job_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_sv TEXT,
  description TEXT,
  description_sv TEXT,
  base_price INTEGER NOT NULL DEFAULT 0,
  min_price INTEGER,
  max_price INTEGER,
  estimated_hours DECIMAL(5,2),
  icon TEXT,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type_id UUID NOT NULL REFERENCES job_types(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_text_sv TEXT,
  question_type question_type NOT NULL DEFAULT 'single_choice',
  is_required BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  help_text TEXT,
  condition JSONB,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Answer Options
CREATE TABLE answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  answer_text_sv TEXT,
  price_modifier_type price_modifier_type NOT NULL DEFAULT 'fixed',
  price_modifier_value INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forms (Estimators)
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  job_type_ids UUID[] NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{"show_price_range": true, "require_phone": false, "require_address": true}'::jsonb,
  styling JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, slug)
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_type_id UUID NOT NULL REFERENCES job_types(id) ON DELETE SET NULL,
  form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  estimated_price_low INTEGER NOT NULL DEFAULT 0,
  estimated_price_high INTEGER NOT NULL DEFAULT 0,
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lead Responses
CREATE TABLE lead_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_option_id UUID REFERENCES answer_options(id) ON DELETE SET NULL,
  raw_answer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_job_types_company_id ON job_types(company_id);
CREATE INDEX idx_questions_job_type_id ON questions(job_type_id);
CREATE INDEX idx_answer_options_question_id ON answer_options(question_id);
CREATE INDEX idx_forms_company_id ON forms(company_id);
CREATE INDEX idx_leads_company_id ON leads(company_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_responses_lead_id ON lead_responses(lead_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_responses ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only access their own companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Job Types: Users can access job types of their companies
CREATE POLICY "Users can view own job types" ON job_types
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own job types" ON job_types
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Questions
CREATE POLICY "Users can view own questions" ON questions
  FOR SELECT USING (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON jt.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own questions" ON questions
  FOR ALL USING (
    job_type_id IN (
      SELECT jt.id FROM job_types jt
      JOIN companies c ON jt.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Answer Options
CREATE POLICY "Users can view own answer options" ON answer_options
  FOR SELECT USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON q.job_type_id = jt.id
      JOIN companies c ON jt.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own answer options" ON answer_options
  FOR ALL USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN job_types jt ON q.job_type_id = jt.id
      JOIN companies c ON jt.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Forms
CREATE POLICY "Users can view own forms" ON forms
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own forms" ON forms
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own leads" ON leads
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
  );

-- Lead Responses
CREATE POLICY "Users can view own lead responses" ON lead_responses
  FOR SELECT USING (
    lead_id IN (
      SELECT l.id FROM leads l
      JOIN companies c ON l.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own lead responses" ON lead_responses
  FOR ALL USING (
    lead_id IN (
      SELECT l.id FROM leads l
      JOIN companies c ON l.company_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- PUBLIC ACCESS FOR ESTIMATOR WIDGET
-- ============================================================================

-- Allow public read access to companies by slug (for public estimator)
CREATE POLICY "Public can view companies by slug" ON companies
  FOR SELECT USING (true);

-- Allow public read access to active job types (for public estimator)
CREATE POLICY "Public can view active job types" ON job_types
  FOR SELECT USING (is_active = true);

-- Allow public read access to questions (for public estimator)
CREATE POLICY "Public can view questions" ON questions
  FOR SELECT USING (true);

-- Allow public read access to answer options (for public estimator)
CREATE POLICY "Public can view answer options" ON answer_options
  FOR SELECT USING (true);

-- Allow public read access to active forms (for public estimator)
CREATE POLICY "Public can view active forms" ON forms
  FOR SELECT USING (is_active = true);

-- Allow public to create leads (from estimator submissions)
CREATE POLICY "Public can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow public to create lead responses
CREATE POLICY "Public can create lead responses" ON lead_responses
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_job_types_updated_at BEFORE UPDATE ON job_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_answer_options_updated_at BEFORE UPDATE ON answer_options FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
