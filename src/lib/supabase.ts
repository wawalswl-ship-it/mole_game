import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * 브라우저용 Supabase 클라이언트.
 * .env 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 없으면 null 이며,
 * 이 경우 점수 저장·리뷰 기능은 자동으로 비활성화됩니다.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "Supabase 가 설정되지 않았습니다. mole-game/.env 파일에 VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를 입력하세요.";
