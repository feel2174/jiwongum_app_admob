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

## 선발대 커뮤니티 테이블 적용

웹 `/community` 화면에서 실제 글/댓글/공감을 저장하려면 커뮤니티 테이블을 원격 Supabase에 적용해야 합니다.

Codex 환경에서는 Supabase access token이 없어 직접 push가 막힐 수 있습니다. 그 경우 아래 둘 중 하나로 적용하세요.

### 방법 1. Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref oxunynxspkxfkokerftl --workdir supabase
npx supabase db push --linked --workdir supabase
```

적용되는 migration:

```text
supabase/migrations/20260719000100_create_community_tables.sql
```

### 방법 2. SQL Editor

Supabase 대시보드 → SQL Editor에서 `supabase/schema.sql`의 `community_posts`, `community_replies`, `community_likes` 구간을 실행합니다.

테이블 적용 후 웹 `/community` 화면은 다음 구조로 동작합니다.

- 상단: 화면 확인용 샘플 글 1개
- 하단: Supabase에 실제 저장된 질문 목록
- 글 작성: `community_posts` insert
- 댓글/대댓글 작성: `community_replies` insert
- 공감: `community_likes` insert/delete 및 `community_posts.likes_count` update
