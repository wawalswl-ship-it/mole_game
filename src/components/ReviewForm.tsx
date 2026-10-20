import { useEffect, useState, type FormEvent } from "react";
import { createReview } from "../services/reviewService";
import { NICKNAME_MAX, type ReviewRecord } from "../types";

interface ReviewFormProps {
  /** 시작 화면에서 입력한 닉네임을 미리 채워 줍니다 */
  defaultNickname?: string;
  /** 등록 성공 시 호출 (목록 새로고침용) */
  onCreated?: (review: ReviewRecord) => void;
}

/** 별점과 리뷰를 Supabase 에 저장하는 폼 */
export function ReviewForm({ defaultNickname = "", onCreated }: ReviewFormProps) {
  const [nickname, setNickname] = useState(defaultNickname);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  // 닉네임 칸이 비어 있을 때 게임을 시작하면 자동으로 채워 줌
  useEffect(() => {
    if (defaultNickname) {
      setNickname((prev) => (prev ? prev : defaultNickname));
    }
  }, [defaultNickname]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("saving");
    const result = await createReview({ nickname, rating, content });
    if (result.ok) {
      setState("idle");
      setMessage("리뷰가 등록되었습니다. 감사합니다!");
      setContent("");
      setRating(5);
      onCreated?.(result.data);
    } else {
      setState("error");
      setMessage(result.error);
    }
  }

  return (
    <form className="mini-form" onSubmit={handleSubmit}>
      <span className="mini-form-label">리뷰 남기기</span>
      <div className="stars" role="radiogroup" aria-label="별점">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n}점`}
            className={`star ${n <= rating ? "star-on" : ""}`}
            onClick={() => setRating(n)}
          >
            ★
          </button>
        ))}
        <span className="stars-label">{rating}점</span>
      </div>
      <input
        className="input"
        placeholder={`닉네임 (${NICKNAME_MAX}자 이내)`}
        maxLength={NICKNAME_MAX}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        disabled={state === "saving"}
        required
      />
      <textarea
        className="input textarea"
        placeholder="게임은 어땠나요? (300자 이내)"
        maxLength={300}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={state === "saving"}
        required
      />
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={state === "saving"}
      >
        {state === "saving" ? "등록 중…" : "리뷰 등록"}
      </button>
      {state === "error" && <p className="form-error">{message}</p>}
      {state === "idle" && message && <p className="form-success">{message}</p>}
    </form>
  );
}
