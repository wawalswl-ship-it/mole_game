import { supabase, SUPABASE_NOT_CONFIGURED_MESSAGE } from "../lib/supabase";
import type { ReviewRecord, ServiceResult } from "../types";

const TABLE = "mole_reviews";

/** 게임 리뷰를 작성합니다. */
export async function createReview(input: {
  nickname: string;
  rating: number;
  content: string;
}): Promise<ServiceResult<ReviewRecord>> {
  if (!supabase) return { ok: false, error: SUPABASE_NOT_CONFIGURED_MESSAGE };

  const nickname = input.nickname.trim();
  const content = input.content.trim();
  if (!nickname) return { ok: false, error: "닉네임을 입력하세요." };
  if (!content) return { ok: false, error: "리뷰 내용을 입력하세요." };
  if (content.length > 300)
    return { ok: false, error: "리뷰는 300자 이하로 입력하세요." };
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    return { ok: false, error: "별점은 1~5 사이여야 합니다." };

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ nickname, rating: input.rating, content })
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data as ReviewRecord };
}

/** 최근 리뷰 목록을 가져옵니다. */
export async function fetchReviews(
  limit = 20,
): Promise<ServiceResult<ReviewRecord[]>> {
  if (!supabase) return { ok: false, error: SUPABASE_NOT_CONFIGURED_MESSAGE };

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as ReviewRecord[] };
}
