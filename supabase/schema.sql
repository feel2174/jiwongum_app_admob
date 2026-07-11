-- 지원금 모아보기 — 콘텐츠(articles) 테이블 + RLS
-- Supabase 대시보드 SQL Editor에서 그대로 실행하면 됨.

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  wp_post_id integer unique,        -- 워드프레스 글과 중복 방지 (수동 입력 시 null)
  title text not null,
  summary text,
  url text not null,
  category text not null,
  situations text[] not null default '{}',
  regions text[] not null default '{전국}',
  date date not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_date_idx
  on articles (published, date desc);

alter table articles enable row level security;

-- 앱(anon key)은 발행된 글만 읽을 수 있음
drop policy if exists "public read published articles" on articles;
create policy "public read published articles"
  on articles for select
  to anon, authenticated
  using (published = true);

-- 어드민(로그인한 authenticated 사용자)은 전체 CRUD 가능
-- (운영자 1인 전용 도구라 role만으로 제한. 여러 관리자를 두게 되면 auth.uid() 기준으로 좁혀야 함)
drop policy if exists "authenticated manage all articles" on articles;
create policy "authenticated manage all articles"
  on articles for all
  to authenticated
  using (true)
  with check (true);
