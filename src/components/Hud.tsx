import type { GameStatus } from "../types";

interface HudProps {
  timeLeft: number;
  duration: number;
  score: number;
  status: GameStatus;
}

/** 남은 시간과 현재 점수를 보여주는 상단 표시 영역 */
export function Hud({ timeLeft, duration, score, status }: HudProps) {
  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const isUrgent = status === "playing" && timeLeft <= 5;

  return (
    <section className="hud" aria-live="polite">
      <div className={`stat ${isUrgent ? "stat-urgent" : ""}`}>
        <span className="stat-label">남은 시간</span>
        <span className="stat-value">
          {timeLeft}
          <small>초</small>
        </span>
      </div>
      <div className="stat">
        <span className="stat-label">현재 점수</span>
        <span className="stat-value">
          {score}
          <small>점</small>
        </span>
      </div>
      <div
        className="time-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={timeLeft}
      >
        <div
          className={`time-bar-fill ${isUrgent ? "time-bar-urgent" : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
