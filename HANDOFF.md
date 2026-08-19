# 작업 인수인계 (HANDOFF)

> 다른 디바이스에서 이어서 작업하기 위한 스냅샷. **이 커밋 시점까지 무엇이 끝났고, 다음에 무엇을 해야 하는가.**
> 마스터 계획은 `jiwongum.md`(= RELEASE-PLAN). 단계별 구현 요약은 `RELEASE-PHASE1.md`(웹) / `RELEASE-APP.md`(앱).
> 이 문서는 그 위에서 **현재 진행 상태 + 재개 방법**만 다룬다.

- **대상 앱**: `com.jiwongum.app` — Google Play / App Store **라이브** 앱의 대규모 리브랜딩 업데이트
- **스택**: Expo SDK 57 / React Native, WebView 래퍼(`senior.zucca100.com`), Supabase, AdMob
- **현재 브랜드(프로덕션)**: `지원금 모아보기` → 목표 브랜드 `어르신 지원금`
- **기준 커밋**: 이 문서를 포함한 커밋 (아래 "커밋에 포함된 변경" 참조)
- ⚠️ **불변 제약**: 패키지명 `com.jiwongum.app`·서명키 변경 금지 / localStorage 키·Supabase 푸시 토큰 보존 / 브랜드 전환은 **편도(되돌릴 수 없음)**

---

## 1. 지금까지 완료된 것 (이 커밋에 담긴 변경)

### Phase 1 — 웹 개편 (라이브 반영 대상, 앱 배포 불필요)
- **웹 브랜드 교체** `시니어 서포트` → `어르신 지원금`: `web/app/layout.js`, `web/app/page.js`, `web/app/help/page.js`
- **OG 이미지** `web/public/og.png` 추가 + layout.js openGraph 연결, **Next 파비콘** `web/app/icon.png`
- **§1.2 하위호환**(구버전 앱 + 신버전 웹 공존): `web/app/globals.css`
  - `.landingMain`/`.searchMain` `padding-bottom: calc(100px + safe-area)` (탭바 가림 방지)
  - `.floatingFontControls` `bottom: calc(16px + safe-area)` (하단 탭바 위로 이격)
- **301 리다이렉트**: `web/next.config.mjs` `redirects()` — `/community`,`/community/*` → `/`

### Phase 2 — 앱 기능 (이름/아이콘은 프로덕션에서 아직 미변경)
- **하단 탭 3→4개**: `App.js` — 홈 / **저장함(⭐ 신규)** / 문의 / 설정. `SavedScreen` 을 탭에 연결.
- **Play Integrity 소프트 게이트**: `src/lib/integrity.js` (신규) — 콘텐츠는 절대 안 막고 **광고만** 좌우. 콜드스타트 1회, 24h 캐시.
- **원격설정 / 킬 스위치**: `src/lib/remoteConfig.js` (신규) + 마이그레이션 `supabase/migrations/20260818000100_add_app_config.sql`
- **광고 소프트 게이트 배선**: `src/lib/adManager.js`(`setAdsEnabled`/`areAdsEnabled`), `src/screens/WebScreen.js`(광고 off면 웹뷰 미등록)
- **`tel:`/`sms:`/`mailto:` 처리**: `src/screens/WebScreen.js` `onShouldStartLoadWithRequest`
- **부팅 배선**: `App.js` — `adsEnabled = remote.adsEnabled && adsAllowedByIntegrity(verdict)`, 실패 시 안전 폴백(광고 on)
- **전환 안내/점검 배너 컴포넌트**: `src/components/RemoteNotices.js` (신규) — Phase 2에 심어두고 Phase 3에 원격 플래그로 켬

### Phase 3 준비물 (스테이징만, 프로덕션 미반영)
- **동적 Expo 설정** `app.config.js` (신규): EAS 프로파일별 `skipIntegrity` 주입 + 브랜드 게이트.
  - dev/preview → 새 브랜드(`어르신 지원금`, `assets/rebrand/*`) + `skipIntegrity=true`
  - **production → 구브랜드 유지** + `skipIntegrity=false`. 새 브랜드 강제 시 `EXPO_PUBLIC_REBRAND=1`
- **코드 스플래시** `src/components/AppSplash.js`: 네이비 코인(₩) + `어르신 지원금` (노란 배경 유지)
- **브랜드 에셋 생성기** `tools/brand-assets/`(`render.mjs`+`template.html`, Chrome 헤드리스)
- **에셋 스테이징**: `assets/rebrand/*`(앱 아이콘/스플래시/알림/파비콘), `store/rebrand/*`(스토어 아이콘·피처그래픽) — **app.json 미반영**

### 문서
- `jiwongum.md`(마스터 계획), `RELEASE-PHASE1.md`(웹 요약), `RELEASE-APP.md`(앱 요약), 그리고 이 `HANDOFF.md`

---

## 2. ⚠️ 아직 안 된 것 / 미검증 (재개 시 최우선)

### Phase 1(웹) — 라이브 반영 확인됨 (2026-08-19)
`senior.zucca100.com`을 직접 확인한 결과, 이 문서의 이전 버전이 "아직 어느 것도 배포 안 됨"이라 적었던 것과 달리 **Phase 1 웹 개편은 이미 프로덕션에 배포되어 있다.** 이 저장소는 `main` push 시 Vercel이 자동 배포하는 구조이며, 이전 세션에서 `b81eb7b`를 push한 시점에 실배포된 것으로 보인다.
- `<title>어르신 지원금</title>`, `/og.png`·`/icon.png`(200), `robots.txt` 라이브 확인
- `/community` → 308 리다이렉트(신규 `legacyRedirects`, `permanent:true`) 라이브 확인
- CSS `padding-bottom:calc(100px + env(safe-area-inset-bottom))` 라이브 확인(§1.2 하위호환 핫픽스)

### 검증되지 않은 것
- [ ] **네이티브 빌드·실기기 테스트 전무.** 이 환경엔 Android SDK가 없어 JS 번들 export만 검증됨. RN 변경(4탭/tel:/스플래시/광고게이트)은 **실기기·에뮬레이터에서 미확인.**
- [ ] `RELEASE-APP.md` 하단 "테스트 체크리스트" 8항목 전부 미수행.
- [ ] 구버전 앱(현재 프로덕션 빌드) 실기기에서 새 웹이 §1.2 규칙대로 정상 동작하는지 — 웹 자체는 라이브지만 구버전 앱 셸과의 조합은 미확인.

### 채워 넣어야 완료되는 것 (플레이스홀더/스텁)
- [ ] **Play Integrity 네이티브 모듈 없음.** `src/lib/integrity.js`의 `runNativeIntegrity()`는 현재 `'unavailable'`(광고 허용측) 고정 반환 — **라이브 수익 보호용 스텁.** 실제 모듈 연결 시 `PLAY_RECOGNIZED+MEETS_DEVICE_INTEGRITY→'ok'`, 그 외/오류→`'failed'` 매핑.
- [ ] **리다이렉트 맵 미완성.** `web/next.config.mjs`의 `legacyRedirects`는 `/community`만 확정. **Search Console/애널리틱스에서 실제 옛 URL을 수집**해 채우고 **404 0건** 확인. (추측 금지 — 잘못된 301은 캐시됨)
- [x] ~~Supabase 마이그레이션 미적용~~ → 대신 어드민 콘솔(`admin/index.html`)에 "앱 설정" 탭을 추가(`9fed562`). anon key는 RLS로 쓰기가 막혀 있어 마이그레이션 SQL을 직접 실행할 수 없었음 — 운영자가 어드민에 로그인해 저장하면 upsert로 `app_config` 행이 즉시 생성된다. **아직 실제로 한 번 저장은 안 해봄 — 로그인 가능한 사람이 어드민 "앱 설정" 탭에서 저장 1회 필요.**

### Phase 0 미착수 항목 (jiwongum.md §3 Phase 0)
- [ ] 프로덕션 지표 스냅샷(DAU·리텐션·체류·AdMob CTR/노출·평점) — **개편 전 기준선.** 안 찍으면 개선/개악 판단 불가.
- [ ] KIPRIS 상표 검색으로 서비스명 최종 확정
- [ ] 스테이징 도메인(`stg.senior.zucca100.com`, `noindex`) 준비

### 후속 기능 (설계상 남겨둠)
- [ ] **웹→네이티브 저장 연동.** 저장함은 현재 네이티브 글 북마크(★)만 표시. 웹뷰에서 본 혜택 저장하려면 웹→네이티브 `postMessage` 연동 필요.
- [ ] iOS 최소버전(SDK 요구 iOS 버전) 대비 기존 사용자 기기 비율 App Store Connect에서 확인(jiwongum.md §6).

---

## 3. 릴리스 순서 (요약 — 상세는 jiwongum.md §3)

```
Phase 1 (웹)    ← 지금 배포 가능. 스토어 심사 없이 전체 사용자 즉시 반영. 롤백=서버 즉시복구
   ↓ 1주 지표 관찰
Phase 2 (기능)  ← 이름/아이콘 유지. Play 내부테스트→5%→20%→50%→100% (단계별 48h+, 크래시율 확인)
   ↓ 100% 후 2주 안정
Phase 3 (브랜드) ← 이름/아이콘/스플래시. 카톡 D-7/D-1 공지 + 인앱 전환안내 필수. 편도.
```

**현재 위치**: Phase 1·2 코드는 작성 완료, **아직 어느 것도 배포 안 됨.** 다음 액션은 §2의 검증·채우기 → Phase 1 웹 배포.

---

## 4. 다른 디바이스에서 재개하는 법

### 4.1 코드 가져오기
```bash
git clone https://github.com/feel2174/jiwongum_app_admob.git
cd jiwongum_app_admob
# (이미 클론돼 있으면) git pull origin main
npm install            # 또는 yarn
cd web && npm install  # 웹(Next.js)은 별도
```

### 4.2 필요한 환경 (이 저장소에 커밋되지 않는 것)
- **Supabase 자격증명**: `src/lib/supabase.js`가 참조하는 URL/anon key (`.env` 또는 app 설정). 없으면 원격설정은 안전 기본값으로만 동작.
- **AdMob 광고 단위 ID**: `src/lib/adManager.js` 참조.
- **Android SDK / Xcode**: 네이티브 빌드·실기기 테스트에 필수 (이 개발 환경엔 없음).
- **EAS 계정**: `eas build` 사용 시.

### 4.3 실행/검증 명령
```bash
# 웹(Phase 1) 로컬 확인
cd web && npm run dev

# 앱 JS 번들 검증(네이티브 없이 가능)
npx expo export --platform android

# 앱 네이티브 빌드(SDK 있는 기기에서)
npx expo run:android            # 로컬 SDK
# 또는
eas build --profile development --platform android

# 브랜드 에셋 재생성(Chrome 헤드리스 필요)
node tools/brand-assets/render.mjs
```

### 4.4 다음 세션에서 바로 할 일 (권장 순서)
1. `jiwongum.md` → `RELEASE-PHASE1.md` → `RELEASE-APP.md` → 이 문서 순으로 읽기
2. **§2 "미검증/미완성" 항목부터** 처리: 리다이렉트 실제 URL 수집, Supabase 마이그레이션 적용, 실기기 테스트
3. Phase 0 지표 스냅샷 확보(배포 전 기준선)
4. Phase 1 웹 배포 → 1주 관찰 → Phase 2 단계적 출시

---

## 5. 파일 인덱스 (이 커밋 기준)

| 파일 | 종류 | 역할 |
|---|---|---|
| `App.js` | 수정 | 4탭 + 부팅 시 원격설정/무결성 배선 + RemoteNotices |
| `src/lib/integrity.js` | 신규 | Play Integrity 소프트 게이트 (네이티브 스텁) |
| `src/lib/remoteConfig.js` | 신규 | Supabase 원격설정/킬 스위치 |
| `src/components/RemoteNotices.js` | 신규 | 점검 배너 + 전환 안내 모달 |
| `src/lib/adManager.js` | 수정 | `setAdsEnabled`/`areAdsEnabled` 스위치 |
| `src/screens/WebScreen.js` | 수정 | `tel:` 처리 + 광고 off 시 웹뷰 미등록 |
| `src/components/AppSplash.js` | 수정 | 코드 스플래시 리브랜딩 |
| `app.config.js` | 신규 | 프로파일별 skipIntegrity + 브랜드 게이트 |
| `supabase/migrations/20260818000100_add_app_config.sql` | 신규 | `app_config` 시드 (미적용) |
| `web/app/{layout,page,help/page}.js` | 수정 | 웹 브랜드 교체 |
| `web/app/globals.css` | 수정 | §1.2 하단 여백/플로팅 이격 |
| `web/next.config.mjs` | 수정 | 301 리다이렉트 (URL 미완성) |
| `web/public/og.png`, `web/app/icon.png` | 신규 | 웹 OG/파비콘 (라이브) |
| `assets/rebrand/*`, `store/rebrand/*` | 신규 | 브랜드 에셋 스테이징 (app.json 미반영) |
| `tools/brand-assets/*` | 신규 | HTML→PNG 에셋 생성기 |
