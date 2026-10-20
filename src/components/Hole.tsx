interface HoleProps {
  index: number;
  hasMole: boolean;
  isHit: boolean;
  disabled: boolean;
  onWhack: (index: number) => void;
}

/** 게임판의 한 칸. 두더지가 있으면 올라온 모습을 보여주고, 누르면 onWhack 을 호출합니다. */
export function Hole({ index, hasMole, isHit, disabled, onWhack }: HoleProps) {
  return (
    <button
      type="button"
      className={`hole ${hasMole ? "hole-active" : ""} ${isHit ? "hole-hit" : ""}`}
      disabled={disabled}
      aria-label={hasMole ? "두더지! 클릭해서 잡기" : "빈 구멍"}
      // 모바일에서 click 보다 빠르게 반응하도록 pointerdown 사용
      onPointerDown={(e) => {
        e.preventDefault();
        onWhack(index);
      }}
    >
      <div className="dirt" />
      <div className={`mole ${hasMole ? "mole-up" : ""}`}>
        <div className="mole-ear mole-ear-left" />
        <div className="mole-ear mole-ear-right" />
        <div className="mole-eye mole-eye-left" />
        <div className="mole-eye mole-eye-right" />
        <div className="mole-nose" />
      </div>
      {isHit && <span className="hit-pop">+1</span>}
    </button>
  );
}
