import type { SaveState } from "../hooks/useScoreAutoSave";

interface GameOverScreenProps {
  score: number;
  nickname: string;
  saveState: SaveState;
  onRetrySave: () => void;
  onRestart: () => void;
  onBackToStart: () => void;
  onWriteReview: () => void;
}

/** 게임 종료 화면: 최종 점수 + 자동 저장 상태 + 다시 하기 / 리뷰 쓰기 */
export function GameOverScreen({
  score,
  nickname,
  saveState,
  onRetrySave,
  onRestart,
  onBackToStart,
  onWriteReview,
}: GameOverScreenProps) {
  return (
    <div className="overlay">
      <div className="overlay-card">
        <h2 className="overlay-title">게임 종료!</h2>
        <p className="final-nickname">{nickname} 님의 점수</p>
        <p className="final-score">
          <span className="final-score-value">{score}</span>
          <span className="final-score-unit">점</span>
        </p>
        <p className="final-message">{getMessage(score)}</p>

        <SaveStatus state={saveState} onRetry={onRetrySave} />

        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            다시 하기
          </button>
          <button type="button" className="btn btn-ghost" onClick={onBackToStart}>
            처음으로
          </button>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onWriteReview}>
          게임 리뷰 남기기
        </button>
      </div>
    </div>
  );
}

function SaveStatus({
  state,
  onRetry,
}: {
  state: SaveState;
  onRetry: () => void;
}) {
  switch (state.phase) {
    case "saving":
      return <p className="notice">점수를 저장하는 중…</p>;
    case "saved":
      return <p className="form-success">점수가 랭킹에 저장되었습니다!</p>;
    case "error":
      return (
        <div className="notice notice-error">
          점수 저장에 실패했어요: {state.message}
          <br />
          <button type="button" className="btn-link" onClick={onRetry}>
            다시 저장하기
          </button>
        </div>
      );
    default:
      return null;
  }
}

function getMessage(score: number): string {
  if (score >= 30) return "두더지 마스터! 믿을 수 없는 반응속도예요.";
  if (score >= 20) return "대단해요! 두더지들이 겁먹었어요.";
  if (score >= 10) return "좋아요! 조금만 더 빠르게!";
  if (score >= 1) return "워밍업 완료. 다시 도전해 볼까요?";
  return "두더지가 한 마리도 안 잡혔어요. 다시 해봐요!";
}
