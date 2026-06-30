GRANT INSERT ON public.assessment_users TO anon;
GRANT INSERT, UPDATE ON public.assessment_sessions TO anon;
GRANT INSERT, UPDATE ON public.assessment_answers TO anon;
GRANT INSERT, SELECT ON public.assessment_results TO anon;

GRANT INSERT, SELECT, UPDATE ON public.assessment_users TO authenticated;
GRANT INSERT, SELECT, UPDATE ON public.assessment_sessions TO authenticated;
GRANT INSERT, SELECT, UPDATE ON public.assessment_answers TO authenticated;
GRANT INSERT, SELECT, UPDATE ON public.assessment_results TO authenticated;

GRANT ALL ON public.assessment_users TO service_role;
GRANT ALL ON public.assessment_sessions TO service_role;
GRANT ALL ON public.assessment_answers TO service_role;
GRANT ALL ON public.assessment_results TO service_role;