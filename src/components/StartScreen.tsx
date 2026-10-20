import { useState, type FormEvent } from "react";
import { NICKNAME_MAX } from "../types";

interface StartScreenProps {
  duration: number;
  defaultNickname: string;
  onStart: (nickname: string) => void;
}

/** 게임 시작 전 화면: 닉네임 입력 + 규칙 안내 (게임판 위에 겹쳐서 표시) */
export function StartScreen({
  duration,
  defaultNickname,
  onStart,
}: StartScreenProps) {
  const [nickname, setNickname] = useState(defaultNickname);
  const trimmed = nickname.trim();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    onStart(trimmed);
  }

  return (
    <div className="overlay">
      <form className="overlay-card" onSubmit={handleSubmit}>
        <h2 className="overlay-title">준비되셨나요?</h2>
        <ul className="rules">
          <li>{duration}초 동안 두더지가 무작위 칸에 나타납니다.</li>
          <li>두더지를 누르면 1점을 얻습니다.</li>
          <li>게임이 끝나면 점수가 자동으로 랭킹에 저장됩니다.</li>
        </ul>
        <label className="field">
          <span className="field-label">닉네임</span>
          <input
            className="input"
            placeholder={`닉네임 (${NICKNAME_MAX}자 이내)`}
            maxLength={NICKNAME_MAX}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={!trimmed}>
          게임 시작
        </button>
      </form>
    </div>
  );
}
