
-- Users (lead-capture, anonymous)
CREATE TABLE public.assessment_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  occupation TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.assessment_users TO anon, authenticated;
GRANT ALL ON public.assessment_users TO service_role;
ALTER TABLE public.assessment_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert users" ON public.assessment_users FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Sessions
CREATE TABLE public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.assessment_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.assessment_sessions TO anon, authenticated;
GRANT ALL ON public.assessment_sessions TO service_role;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert sessions" ON public.assessment_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can update sessions" ON public.assessment_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Answers
CREATE TABLE public.assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id)
);
GRANT SELECT, INSERT, UPDATE ON public.assessment_answers TO anon, authenticated;
GRANT ALL ON public.assessment_answers TO service_role;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can upsert answers" ON public.assessment_answers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can update answers" ON public.assessment_answers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Results
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  profile_code TEXT NOT NULL,
  scores JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.assessment_results TO anon, authenticated;
GRANT ALL ON public.assessment_results TO service_role;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert results" ON public.assessment_results FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read results" ON public.assessment_results FOR SELECT TO anon, authenticated USING (true);
