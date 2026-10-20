import { useEffect, useState } from "react";
import { fetchTopScores } from "../services/scoreService";
import type { ScoreRecord } from "../types";

interface LeaderboardProps {
  /** 값이 바뀌면 목록을 다시 불러옵니다 */
  refreshKey: number;
  /** 강조할 닉네임(현재 플레이어) */
  highlightNickname?: string;
}

const MEDALS = ["1", "2", "3"];

/** Supabase 에 저장된 상위 10명 점수 목록 */
export function Leaderboard({ refreshKey, highlightNickname }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTopScores(10).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setScores(result.data);
        setError("");
      } else {
        setError(result.error);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading && scores.length === 0) {
    return <p className="panel-empty">랭킹을 불러오는 중…</p>;
  }
  if (error) {
    return <p className="form-error">랭킹을 불러오지 못했어요: {error}</p>;
  }
  if (scores.length === 0) {
    return (
      <p className="panel-empty">
        아직 기록이 없어요. 첫 번째 기록의 주인공이 되어 보세요!
      </p>
    );
  }

  return (
    <ol className="rank-list">
      {scores.map((s, i) => (
        <li
          key={s.id}
          className={`rank-item ${i < 3 ? `rank-top rank-top-${i + 1}` : ""} ${
            s.nickname === highlightNickname ? "rank-me" : ""
          }`}
        >
          <span className="rank-no">{MEDALS[i] ?? `${i + 1}`}</span>
          <span className="rank-name">{s.nickname}</span>
          <span className="rank-date">{formatDate(s.created_at)}</span>
          <span className="rank-score">{s.score}점</span>
        </li>
      ))}
    </ol>
  );
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}
