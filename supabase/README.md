# Supabase 설정 순서 (1회성)

1. **프로젝트 생성**: https://supabase.com 에서 무료 프로젝트 생성.
2. **스키마 적용**: 대시보드 → SQL Editor → `schema.sql` 내용을 붙여넣고 실행.
3. **키 확인**: Project Settings → API에서
   - `Project URL`
   - `anon public` key
   - `service_role` key (마이그레이션 스크립트에서만 사용, 절대 커밋/노출 금지)
4. **앱에 키 반영**: 저장소 루트에 `.env` 생성 (`.env.example` 참고)
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. **어드민에 키 반영**: `admin/index.html` 상단의 `SUPABASE_URL` / `SUPABASE_ANON_KEY` 값을 채움.
6. **어드민 로그인 계정 생성**: 대시보드 → Authentication → Users → 운영자 이메일/비밀번호로 1명 추가.
7. **Edge Function 배포** (Supabase CLI 필요: `npm i -g supabase`):
   ```
   supabase login
   supabase link --project-ref <project-ref>
   supabase functions deploy get-wp-posts
   ```
8. **기존 41개 글 마이그레이션**:
   ```
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-articles.js
   ```
9. **어드민 페이지 배포**: `admin/` 폴더를 Vercel(추천) 또는 GitHub Pages 등 아무 정적 호스팅에 올림. 로그인 없이는 데이터에 접근 못 하므로 공개 URL이어도 무방.

이후 새 글 추가는 배포된 어드민 페이지에서 "새 글 가져오기" → 태그 선택 → 발행만 누르면 앱에 바로 반영됨 (앱은 시작 시 자동으로 최신 목록을 가져옴).
