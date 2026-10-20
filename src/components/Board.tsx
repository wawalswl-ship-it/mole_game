import { Hole } from "./Hole";

interface BoardProps {
  gridSize: number;
  holeCount: number;
  moleIndex: number | null;
  hitIndex: number | null;
  disabled: boolean;
  onWhack: (index: number) => void;
}

/** gridSize × gridSize 칸으로 이루어진 게임판 */
export function Board({
  gridSize,
  holeCount,
  moleIndex,
  hitIndex,
  disabled,
  onWhack,
}: BoardProps) {
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      aria-label="두더지 게임판"
    >
      {Array.from({ length: holeCount }, (_, index) => (
        <Hole
          key={index}
          index={index}
          hasMole={moleIndex === index}
          isHit={hitIndex === index}
          disabled={disabled}
          onWhack={onWhack}
        />
      ))}
    </div>
  );
}
