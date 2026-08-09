-- 앱/웹 전역 설정용 키-값 테이블. '오늘의 혜택' 컴포넌트 on/off + 설명 문구를 어드민이 제어.
create table if not exists app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

-- 앱/웹(anon)은 설정을 읽을 수 있음
drop policy if exists "public read app_settings" on app_settings;
create policy "public read app_settings"
  on app_settings for select
  to anon, authenticated
  using (true);

-- 어드민(로그인한 authenticated 사용자)만 쓰기
drop policy if exists "authenticated write app_settings" on app_settings;
create policy "authenticated write app_settings"
  on app_settings for all
  to authenticated
  using (true)
  with check (true);

-- '오늘의 혜택' 기본값 (표시 ON, 설명 빈 문자열)
insert into app_settings (key, value)
values ('todays_benefit', '{"enabled": true, "note": ""}'::jsonb)
on conflict (key) do nothing;
