import { useEffect, useState } from "react";
import { fetchReviews } from "../services/reviewService";
import type { ReviewRecord } from "../types";
import { formatDate } from "./Leaderboard";

interface ReviewListProps {
  refreshKey: number;
}

/** Supabase 에 저장된 최근 리뷰 목록 */
export function ReviewList({ refreshKey }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchReviews(20).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setReviews(result.data);
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

  if (loading && reviews.length === 0) {
    return <p className="panel-empty">리뷰를 불러오는 중…</p>;
  }
  if (error) {
    return <p className="form-error">리뷰를 불러오지 못했어요: {error}</p>;
  }
  if (reviews.length === 0) {
    return <p className="panel-empty">아직 리뷰가 없어요. 첫 리뷰를 남겨 주세요!</p>;
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="review-list-wrap">
      <p className="review-summary">
        평균 <strong>{avg.toFixed(1)}</strong> / 5 · 리뷰 {reviews.length}개
      </p>
      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r.id} className="review-item">
            <div className="review-head">
              <span className="review-name">{r.nickname}</span>
              <span className="review-stars" aria-label={`${r.rating}점`}>
                {"★".repeat(r.rating)}
                <span className="review-stars-off">{"★".repeat(5 - r.rating)}</span>
              </span>
              <span className="review-date">{formatDate(r.created_at)}</span>
            </div>
            <p className="review-content">{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
