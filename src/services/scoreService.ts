import { supabase, SUPABASE_NOT_CONFIGURED_MESSAGE } from "../lib/supabase";
import type { ScoreRecord, ServiceResult } from "../types";

const TABLE = "mole_scores";

/** 게임 종료 후 점수를 저장합니다. */
export async function saveScore(input: {
  nickname: string;
  score: number;
}): Promise<ServiceResult<ScoreRecord>> {
  if (!supabase) return { ok: false, error: SUPABASE_NOT_CONFIGURED_MESSAGE };

  const nickname = input.nickname.trim();
  if (!nickname) return { ok: false, error: "닉네임을 입력하세요." };
  if (nickname.length > 20)
    return { ok: false, error: "닉네임은 20자 이하로 입력하세요." };

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ nickname, score: input.score })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as ScoreRecord };
}

/** 상위 점수 목록을 가져옵니다. */
export async function fetchTopScores(
  limit = 10,
): Promise<ServiceResult<ScoreRecord[]>> {
  if (!supabase) return { ok: false, error: SUPABASE_NOT_CONFIGURED_MESSAGE };

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as ScoreRecord[] };
}
