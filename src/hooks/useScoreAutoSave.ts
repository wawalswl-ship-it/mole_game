import { useCallback, useEffect, useRef, useState } from "react";
import { saveScore } from "../services/scoreService";
import type { GameStatus } from "../types";

export type SaveState =
  | { phase: "idle" }
  | { phase: "saving" }
  | { phase: "saved" }
  | { phase: "error"; message: string };

/**
 * 게임이 끝나면(status === "ended") 점수를 Supabase 에 자동 저장합니다.
 * 같은 판(gameId)은 한 번만 저장하며, 실패 시 retry() 로 다시 시도할 수 있습니다.
 */
export function useScoreAutoSave(params: {
  status: GameStatus;
  gameId: number;
  score: number;
  nickname: string;
  /** 저장 성공 시 호출 (랭킹 새로고침 등) */
  onSaved?: () => void;
}) {
  const { status, gameId, score, nickname, onSaved } = params;
  const [state, setState] = useState<SaveState>({ phase: "idle" });
  const savedGameRef = useRef<number>(0);
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  const save = useCallback(async () => {
    setState({ phase: "saving" });
    const result = await saveScore({ nickname, score });
    if (result.ok) {
      setState({ phase: "saved" });
      onSavedRef.current?.();
    } else {
      setState({ phase: "error", message: result.error });
    }
  }, [nickname, score]);

  useEffect(() => {
    if (status !== "ended") return;
    if (savedGameRef.current === gameId) return; // 이미 이 판은 저장 시도함
    savedGameRef.current = gameId;
    void save();
  }, [status, gameId, save]);

  useEffect(() => {
    if (status === "playing") setState({ phase: "idle" });
  }, [status]);

  return { state, retry: save };
}
