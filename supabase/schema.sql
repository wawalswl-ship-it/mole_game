-- 두더지 잡기 게임: 점수 / 리뷰 테이블
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 실행하세요.

create extension if not exists "pgcrypto";

-- 점수 기록
create table if not exists public.mole_scores (
  id          uuid primary key default gen_random_uuid(),
  nickname    text not null check (char_length(nickname) between 1 and 20),
  score       integer not null check (score >= 0),
  created_at  timestamptz not null default now()
);

create index if not exists mole_scores_score_idx
  on public.mole_scores (score desc, created_at asc);

-- 리뷰
create table if not exists public.mole_reviews (
  id          uuid primary key default gen_random_uuid(),
  nickname    text not null check (char_length(nickname) between 1 and 20),
  rating      smallint not null check (rating between 1 and 5),
  content     text not null check (char_length(content) between 1 and 300),
  created_at  timestamptz not null default now()
);

create index if not exists mole_reviews_created_idx
  on public.mole_reviews (created_at desc);

-- 브라우저(anon 키)에서 직접 접근하므로 RLS 를 켜고
-- "누구나 읽기 / 누구나 추가" 만 허용합니다. 수정·삭제는 불가.
alter table public.mole_scores  enable row level security;
alter table public.mole_reviews enable row level security;

drop policy if exists "scores: anyone can read"   on public.mole_scores;
drop policy if exists "scores: anyone can insert" on public.mole_scores;
create policy "scores: anyone can read"
  on public.mole_scores for select to anon, authenticated using (true);
create policy "scores: anyone can insert"
  on public.mole_scores for insert to anon, authenticated with check (true);

drop policy if exists "reviews: anyone can read"   on public.mole_reviews;
drop policy if exists "reviews: anyone can insert" on public.mole_reviews;
create policy "reviews: anyone can read"
  on public.mole_reviews for select to anon, authenticated using (true);
create policy "reviews: anyone can insert"
  on public.mole_reviews for insert to anon, authenticated with check (true);
