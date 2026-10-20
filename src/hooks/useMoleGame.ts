import { useCallback, useEffect, useRef, useState } from "react";
import { GAME_CONFIG, type GameStatus } from "../types";

/** 0 ~ (count-1) 중 exclude 와 다른 무작위 인덱스 */
function randomHole(count: number, exclude: number | null): number {
  if (count <= 1) return 0;
  let next = Math.floor(Math.random() * count);
  while (next === exclude) {
    next = Math.floor(Math.random() * count);
  }
  return next;
}

export interface MoleGame {
  status: GameStatus;
  timeLeft: number;
  score: number;
  /** 두더지가 있는 칸 인덱스. 없으면 null */
  moleIndex: number | null;
  /** 방금 맞은 칸 인덱스(히트 애니메이션용). 없으면 null */
  hitIndex: number | null;
  holeCount: number;
  duration: number;
  /** 게임 판 번호. start() 할 때마다 1씩 증가 (한 판 = 점수 1회 저장) */
  gameId: number;
  start: () => void;
  reset: () => void;
  whack: (index: number) => void;
}

/**
 * 두더지 잡기 게임의 모든 상태와 규칙을 담당하는 훅.
 * UI 컴포넌트는 이 훅이 돌려주는 값만 사용하면 됩니다.
 */
export function useMoleGame(): MoleGame {
  const holeCount = GAME_CONFIG.gridSize * GAME_CONFIG.gridSize;
  const { duration, moleInterval } = GAME_CONFIG;

  const [status, setStatus] = useState<GameStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [score, setScore] = useState(0);
  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [hitIndex, setHitIndex] = useState<number | null>(null);
  const [gameId, setGameId] = useState(0);

  // 두더지 이동 타이머를 다시 시작시키기 위한 카운터
  const [moveCycle, setMoveCycle] = useState(0);
  const hitTimeoutRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setScore(0);
    setTimeLeft(duration);
    setHitIndex(null);
    setMoleIndex(randomHole(holeCount, null));
    setMoveCycle((c) => c + 1);
    setGameId((g) => g + 1);
    setStatus("playing");
  }, [duration, holeCount]);

  const reset = useCallback(() => {
    setStatus("idle");
    setScore(0);
    setTimeLeft(duration);
    setMoleIndex(null);
    setHitIndex(null);
  }, [duration]);

  // 1초마다 남은 시간 감소
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  // 시간이 0이 되면 게임 종료
  useEffect(() => {
    if (status === "playing" && timeLeft <= 0) {
      setStatus("ended");
      setMoleIndex(null);
    }
  }, [status, timeLeft]);

  // 일정 주기로 두더지 위치 이동 (moveCycle 이 바뀌면 타이머를 새로 시작)
  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => {
      setMoleIndex((prev) => randomHole(holeCount, prev));
    }, moleInterval);
    return () => window.clearInterval(id);
  }, [status, moveCycle, holeCount, moleInterval]);

  // 언마운트 시 히트 애니메이션 타이머 정리
  useEffect(() => {
    return () => {
      if (hitTimeoutRef.current !== null) {
        window.clearTimeout(hitTimeoutRef.current);
      }
    };
  }, []);

  const whack = useCallback(
    (index: number) => {
      if (status !== "playing" || index !== moleIndex) return;

      setScore((s) => s + 1);
      setMoleIndex((prev) => randomHole(holeCount, prev));
      setMoveCycle((c) => c + 1); // 잡은 직후 이동 타이머 재시작

      setHitIndex(index);
      if (hitTimeoutRef.current !== null) {
        window.clearTimeout(hitTimeoutRef.current);
      }
      hitTimeoutRef.current = window.setTimeout(() => setHitIndex(null), 300);
    },
    [status, moleIndex, holeCount],
  );

  return {
    status,
    timeLeft,
    score,
    moleIndex,
    hitIndex,
    holeCount,
    duration,
    gameId,
    start,
    reset,
    whack,
  };
}
