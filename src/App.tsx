import { useCallback, useRef, useState } from "react";
import { useMoleGame } from "./hooks/useMoleGame";
import { useScoreAutoSave } from "./hooks/useScoreAutoSave";
import { Board } from "./components/Board";
import { Hud } from "./components/Hud";
import { StartScreen } from "./components/StartScreen";
import { GameOverScreen } from "./components/GameOverScreen";
import { Leaderboard } from "./components/Leaderboard";
import { ReviewForm } from "./components/ReviewForm";
import { ReviewList } from "./components/ReviewList";
import { isSupabaseConfigured } from "./lib/supabase";
import { GAME_CONFIG, type GameStatus } from "./types";

const STATUS_LABEL: Record<GameStatus, string> = {
  idle: "시작 전",
  playing: "진행 중",
  ended: "종료",
};

type Tab = "rank" | "review";

export default function App() {
  const game = useMoleGame();
  const [nickname, setNickname] = useState("");
  const [tab, setTab] = useState<Tab>("rank");
  const [rankRefresh, setRankRefresh] = useState(0);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const panelRef = useRef<HTMLElement>(null);

  // 게임이 끝나면 점수를 자동으로 Supabase 에 저장하고 랭킹을 새로고침
  const { state: saveState, retry: retrySave } = useScoreAutoSave({
    status: game.status,
    gameId: game.gameId,
    score: game.score,
    nickname,
    onSaved: () => setRankRefresh((n) => n + 1),
  });

  const handleStart = useCallback(
    (name: string) => {
      setNickname(name);
      game.start();
    },
    [game],
  );

  function goToReview() {
    setTab("review");
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-heading">
          <h1 className="app-title">경영정보학과_2022026037_조민지</h1>
          <p className="app-subtitle">두더지 잡기 게임</p>
        </div>
        <span className={`status-badge status-${game.status}`}>
          {STATUS_LABEL[game.status]}
        </span>
      </header>

      <Hud
        timeLeft={game.timeLeft}
        duration={game.duration}
        score={game.score}
        status={game.status}
      />

      <section className="board-wrap">
        <Board
          gridSize={GAME_CONFIG.gridSize}
          holeCount={game.holeCount}
          moleIndex={game.moleIndex}
          hitIndex={game.hitIndex}
          disabled={game.status !== "playing"}
          onWhack={game.whack}
        />

        {game.status === "idle" && (
          <StartScreen
            duration={game.duration}
            defaultNickname={nickname}
            onStart={handleStart}
          />
        )}

        {game.status === "ended" && (
          <GameOverScreen
            score={game.score}
            nickname={nickname}
            saveState={saveState}
            onRetrySave={retrySave}
            onRestart={game.start}
            onBackToStart={game.reset}
            onWriteReview={goToReview}
          />
        )}
      </section>

      <section className="panel" ref={panelRef}>
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "rank"}
            className={`tab ${tab === "rank" ? "tab-active" : ""}`}
            onClick={() => setTab("rank")}
          >
            랭킹 TOP 10
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "review"}
            className={`tab ${tab === "review" ? "tab-active" : ""}`}
            onClick={() => setTab("review")}
          >
            리뷰
          </button>
        </div>

        {!isSupabaseConfigured ? (
          <p className="notice">
            Supabase 가 설정되지 않아 랭킹·리뷰를 사용할 수 없어요.
            <br />
            mole-game/.env 파일에 VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를
            입력하세요.
          </p>
        ) : tab === "rank" ? (
          <Leaderboard refreshKey={rankRefresh} highlightNickname={nickname} />
        ) : (
          <div className="review-panel">
            <ReviewForm
              defaultNickname={nickname}
              onCreated={() => setReviewRefresh((n) => n + 1)}
            />
            <ReviewList refreshKey={reviewRefresh} />
          </div>
        )}
      </section>

      <footer className="app-footer">
        {GAME_CONFIG.gridSize}×{GAME_CONFIG.gridSize} 게임판 · {game.duration}초 ·
        두더지 1마리 = 1점
        <br />
        경영정보학과_2022026037_조민지
      </footer>
    </main>
  );
}
