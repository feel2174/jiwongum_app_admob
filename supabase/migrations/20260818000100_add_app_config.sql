-- 원격 설정 / 킬 스위치 (릴리스 계획 §7).
-- 기존 app_settings(key-value jsonb) 테이블을 재사용한다.
-- 앱은 부팅 시 'app_config' 키를 1회 읽어 광고 on/off·점검 공지·전환 안내를 제어한다.
-- (앱 배포/스토어 심사 없이 즉시 반영)
--
--   adsEnabled       boolean  광고 노출 on/off
--   maintenance      object|null  { "title": "...", "message": "..." } 이면 상단 점검 배너 노출
--   transitionNotice boolean  브랜드 전환 1회성 안내 모달(§4.2) on/off
insert into app_settings (key, value)
values (
  'app_config',
  '{"adsEnabled": true, "maintenance": null, "transitionNotice": false}'::jsonb
)
on conflict (key) do nothing;
