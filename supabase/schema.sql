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

-- 푸시 알림 대상 기기 토큰 (전체 브로드캐스트용, 상황별 타겟팅 없음)
create table if not exists push_tokens (
  token text primary key,
  created_at timestamptz not null default now()
);

alter table push_tokens enable row level security;

-- 앱(anon)이 알림 허용 시 자기 토큰을 등록/해제할 수 있음. select는 안 열어줌(대량 수집 방지).
-- notify-new-article Edge Function은 service_role로 조회하므로 RLS와 무관하게 전체를 볼 수 있음.
drop policy if exists "anon register token" on push_tokens;
drop policy if exists "anyone can insert token" on push_tokens;
create policy "anyone can insert token"
  on push_tokens for insert
  to public
  with check (true);

drop policy if exists "anon unregister token" on push_tokens;
create policy "anon unregister token"
  on push_tokens for delete
  to public
  using (true);

-- 선발대 커뮤니티: 테스트 기간에는 로그인 없이 익명 글/댓글/공감 저장
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  policy text not null,
  title text not null,
  body text not null,
  author_label text not null default '선발대',
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_created_at_idx
  on community_posts (created_at desc);

alter table community_posts enable row level security;

drop policy if exists "public read community posts" on community_posts;
create policy "public read community posts"
  on community_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert community posts" on community_posts;
create policy "public insert community posts"
  on community_posts for insert
  to anon, authenticated
  with check (true);

drop policy if exists "public update community post likes" on community_posts;
create policy "public update community post likes"
  on community_posts for update
  to anon, authenticated
  using (true)
  with check (true);

create table if not exists community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  parent_reply_id uuid references community_replies(id) on delete cascade,
  body text not null,
  author_label text not null default '댓글 선발대',
  created_at timestamptz not null default now()
);

create index if not exists community_replies_post_id_idx
  on community_replies (post_id, created_at asc);

alter table community_replies enable row level security;

drop policy if exists "public read community replies" on community_replies;
create policy "public read community replies"
  on community_replies for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert community replies" on community_replies;
create policy "public insert community replies"
  on community_replies for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated delete community replies" on community_replies;
create policy "authenticated delete community replies"
  on community_replies for delete
  to authenticated
  using (true);

create table if not exists community_likes (
  post_id uuid not null references community_posts(id) on delete cascade,
  client_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, client_id)
);

alter table community_likes enable row level security;

drop policy if exists "public read community likes" on community_likes;
create policy "public read community likes"
  on community_likes for select
  to anon, authenticated
  using (true);

drop policy if exists "public insert community likes" on community_likes;
create policy "public insert community likes"
  on community_likes for insert
  to anon, authenticated
  with check (true);

drop policy if exists "public delete community likes" on community_likes;
create policy "public delete community likes"
  on community_likes for delete
  to anon, authenticated
  using (true);
