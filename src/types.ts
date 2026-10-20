/** 게임 진행 상태: 시작 전 / 진행 중 / 종료 */
export type GameStatus = "idle" | "playing" | "ended";

/** 게임 규칙 상수 */
export const GAME_CONFIG = {
  /** 게임판 한 변의 칸 수 (4 → 4×4 = 16칸) */
  gridSize: 4,
  /** 게임 시간(초) */
  duration: 30,
  /** 두더지가 다른 자리로 이동하는 주기(ms) */
  moleInterval: 800,
} as const;

/** 닉네임 최대 길이 (DB 제약과 동일) */
export const NICKNAME_MAX = 20;

/** Supabase mole_scores 테이블 한 행 */
export interface ScoreRecord {
  id: string;
  nickname: string;
  score: number;
  created_at: string;
}

/** Supabase mole_reviews 테이블 한 행 */
export interface ReviewRecord {
  id: string;
  nickname: string;
  rating: number; // 1 ~ 5
  content: string;
  created_at: string;
}

/** 서비스 함수 공통 반환 타입 */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
