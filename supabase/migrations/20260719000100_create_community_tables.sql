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
