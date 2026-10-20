# 경영정보학과_2022026037_조민지 — 두더지 잡기 게임

React + Vite + Supabase 로 만든 두더지 잡기 웹사이트입니다.
4×4 게임판에서 30초 동안 무작위로 나타나는 두더지를 클릭해 점수를 얻습니다.
모바일과 PC 모두에서 플레이할 수 있습니다.

## 기능

- 시작 화면에서 닉네임 입력 → 게임 종료 시 **점수가 자동으로 Supabase 에 저장**
- 랭킹 TOP 10 (Supabase 에서 조회, 내 닉네임 강조)
- 게임 리뷰 작성(별점 1~5 + 내용) 및 최근 리뷰 20개 목록, 평균 별점 표시

## 실행 방법 (처음 하는 분 기준)

1. Node.js 20.19 이상 설치 (터미널에서 `node -v` 로 확인)
2. 이 폴더로 이동

   ```bash
   cd mole-game
   ```

3. 패키지 설치 (처음 한 번만)

   ```bash
   npm install
   ```

4. `.env` 파일을 만들고 Supabase 값을 넣습니다. (아래 "Supabase 연동" 참고)
5. 개발 서버 실행

   ```bash
   npm run dev
   ```

6. http://localhost:5173 접속

배포용 파일을 만들려면 `npm run build` → `dist/` 폴더가 생성됩니다.

## 게임 규칙

- 시작 버튼을 누르면 30초 타이머가 시작됩니다.
- 두더지는 0.8초마다 다른 칸으로 이동하며, 잡으면 즉시 다른 칸으로 이동합니다.
- 두더지 한 마리 = 1점.
- 시간이 끝나면 점수가 자동 저장되고 종료 화면이 나타납니다.

게임 시간, 게임판 크기, 두더지 이동 속도는 `src/types.ts` 의 `GAME_CONFIG` 에서 바꿀 수 있습니다.

## Supabase 연동

1. https://supabase.com 에서 프로젝트를 만듭니다.
2. **SQL Editor** 에서 `supabase/schema.sql` 내용을 붙여 넣고 실행합니다.
   (`mole_scores`, `mole_reviews` 테이블 + "누구나 읽기/추가, 수정·삭제 불가" RLS 정책)
3. **Project Settings → API** 에서 `Project URL` 과 `anon public` 키를 복사합니다.
4. 이 폴더에 `.env` 파일을 만들고 입력합니다. (`.env.example` 참고)

   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

5. 개발 서버를 다시 시작합니다.

`.env` 가 없으면 게임은 동작하지만 점수 저장·랭킹·리뷰는 비활성화됩니다.

## Vercel 배포

1. 저장소를 GitHub 에 올립니다. (`.env` 는 `.gitignore` 에 있어 올라가지 않습니다)
2. https://vercel.com/new 에서 저장소를 Import 합니다.
3. **Root Directory** 를 `mole-game` 으로 지정합니다. (Framework: Vite 자동 인식)
4. **Environment Variables** 에 아래 두 개를 추가합니다.

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Supabase anon public 키 |

5. Deploy 를 누릅니다.

## 폴더 구조

```
mole-game/
├─ index.html                 # 진입 HTML (제목)
├─ src/
│  ├─ main.tsx                # React 마운트
│  ├─ App.tsx                 # 화면 전체 구성, 닉네임 상태, 랭킹/리뷰 탭
│  ├─ index.css               # 전체 스타일 (모바일/PC 반응형)
│  ├─ types.ts                # 게임 상태 타입, 설정값, DB 레코드 타입
│  ├─ hooks/
│  │  ├─ useMoleGame.ts       # 게임 규칙·타이머·점수 로직
│  │  └─ useScoreAutoSave.ts  # 게임 종료 시 점수 자동 저장 (한 판 1회)
│  ├─ components/
│  │  ├─ Hud.tsx              # 남은 시간 / 현재 점수
│  │  ├─ Board.tsx, Hole.tsx  # 4×4 게임판과 각 칸
│  │  ├─ StartScreen.tsx      # 닉네임 입력 + 시작
│  │  ├─ GameOverScreen.tsx   # 최종 점수 + 저장 상태 + 다시 하기
│  │  ├─ Leaderboard.tsx      # 랭킹 TOP 10
│  │  ├─ ReviewForm.tsx       # 리뷰 작성 폼
│  │  └─ ReviewList.tsx       # 리뷰 목록
│  ├─ lib/supabase.ts         # Supabase 클라이언트 (환경변수 없으면 null)
│  └─ services/
│     ├─ scoreService.ts      # saveScore, fetchTopScores
│     └─ reviewService.ts     # createReview, fetchReviews
└─ supabase/schema.sql        # 테이블 + RLS 정책
```
