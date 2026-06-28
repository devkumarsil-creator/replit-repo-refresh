import { supabase } from '@/integrations/supabase/client';
import type { DimensionScores } from './scoring';

export interface UserInfo {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  occupation?: string;
  country?: string;
}

export interface SessionData {
  userId: string;
  sessionId: string;
}

const STORAGE_KEY = 'personascope_session';

export function getSavedSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function saveSession(data: SessionData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export async function createUserAndSession(info: UserInfo): Promise<SessionData> {
  const { data: userData, error: userError } = await supabase
    .from('assessment_users')
    .insert({
      name: info.name,
      email: info.email,
      age: info.age ?? null,
      gender: info.gender ?? null,
      occupation: info.occupation ?? null,
      country: info.country ?? null,
    })
    .select('id')
    .single();

  if (userError || !userData) {
    throw new Error(userError?.message ?? 'Failed to create user');
  }

  const { data: sessionData, error: sessionError } = await supabase
    .from('assessment_sessions')
    .insert({ user_id: userData.id, status: 'in_progress' })
    .select('id')
    .single();

  if (sessionError || !sessionData) {
    throw new Error(sessionError?.message ?? 'Failed to create session');
  }

  const result: SessionData = { userId: userData.id, sessionId: sessionData.id };
  saveSession(result);
  return result;
}

export async function saveAnswer(
  sessionId: string,
  questionId: number,
  value: number,
): Promise<void> {
  await supabase
    .from('assessment_answers')
    .upsert(
      { session_id: sessionId, question_id: questionId, value },
      { onConflict: 'session_id,question_id' },
    );
}

export async function saveResult(
  sessionId: string,
  profileCode: string,
  scores: DimensionScores,
): Promise<void> {
  const [, sessionUpdate] = await Promise.all([
    supabase.from('assessment_results').insert({
      session_id: sessionId,
      profile_code: profileCode,
      scores: scores as never,
    }),
    supabase
      .from('assessment_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', sessionId),
  ]);

  if (sessionUpdate.error) {
    console.error('Failed to update session status:', sessionUpdate.error.message);
  }
}
