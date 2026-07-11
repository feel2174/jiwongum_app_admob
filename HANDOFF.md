# HANDOFF — 지원금 모아보기 (프로젝트 인수인계 문서)

> 다른 PC/세션(맥북 Claude Code 등)에서 이어갈 때 **이 파일을 먼저 읽어** 맥락을 복원하세요.
> "HANDOFF.md 읽고 이어서 해줘" 한마디면 됩니다. 세부는 각 문서 링크 참고.

---

## 1. 한 줄 요약
정부 **지원금·정책**을 상황(대상)별로 **맞춤 추천**해주는 React Native(Expo) 앱.
콘텐츠는 운영자의 워드프레스(zucca100.com) 글을 큐레이션, 앱은 AdMob·웹은 AdSense로 이중 수익.

## 2. 핵심 컨셉 (중요)
- **"모든 지원금 목록"이 아니라 "내가 받을 수 있는 지원금을 골라주는" 앱.**
- 각 글에 **상황 태그**(청년/신혼·육아/구직·취업/주거/시니어/소상공인/저소득·복지) 부여 → 온보딩에서 받은 프로필과 **규칙 기반 매칭**으로 개인화.
- 컨셉 리디자인 상세: 세션에서 만든 아티팩트(redesign v2) — 목록→맞춤 finder 전환, IA, 와이어프레임.

## 3. 수익 모델 (합법 구조)
- **앱 내부 = AdMob** (배너+전면광고), **앱 밖 = AdSense** (시스템 브라우저로 zucca100.com 원문 오픈).
- ⚠️ **AdSense를 앱 WebView에 임베드하면 계정 밴.** 반드시 시스템 브라우저(`WebBrowser.openBrowserAsync` = Custom Tabs/SFSafariViewController)로만 오픈. → `src/lib/openLink.js`.
- 전면광고 밴 방지 캡은 `src/lib/adManager.js`의 `CAPS`에서 단일 관리(조회 3회 후 / 90초 간격 / 세션 4회 / 복귀 억제).

## 4. 기술 스택 / 버전 (건드리지 말 것)
- **Expo SDK 56 / React Native 0.85.3** (SDK 57은 AdMob 미지원으로 다운그레이드함 — 올리지 말 것)
- **react-native-google-mobile-ads 16.3.4** (16.4.0은 play-services-ads 25.4.0=Kotlin 2.3.0 이라 빌드 실패 → 16.3.4로 고정, 정확히 이 버전 유지)
- React Navigation v7, AsyncStorage, expo-web-browser, expo-notifications, expo-tracking-transparency
- ⚠️ **Expo Go로는 실행 불가** (AdMob 네이티브). Dev Build 필요 — `TESTING.md` 참고.

## 5. 코드 구조
```
App.js                 온보딩 게이트 + 탭(홈·탐색·검색·저장) + 스택(Detail/Collection/Settings) + 광고init + 푸시핸들러
src/
  theme.js             라이트/다크 팔레트 + shadow
  data/mock.js         CATEGORIES/SITUATIONS/REGIONS(고정) + SEED_ARTICLES(오프라인/초기 폴백 41개)
  lib/
    reco.js            규칙 기반 추천/매칭 — 전부 articles를 인자로 받는 순수함수 (findArticle, news 포함)
    supabase.js        supabase-js 클라이언트 (EXPO_PUBLIC_SUPABASE_URL/ANON_KEY, .env)
    content.js          fetchArticles() — Supabase에서 published 글만 조회
    adManager.js       전면광고 밴 방지 캡 (실 AdMob ID 들어있음)
    openLink.js        광고판정 → 시스템 브라우저
    store.js/storage.js 북마크·알림설정·프로필·articles(캐시+원격fetch) 상태 관리
    push.js            로컬 알림 데모 (원격 푸시는 향후, 이번 범위 제외)
  components/          ArticleCard, SectionHeader, Header, NewsSection
  screens/            Onboarding, Home, Explore, Collection, Search, Saved, Settings, Detail
admin/index.html       콘텐츠 관리 어드민(정적 페이지) — WP 글 가져오기+태깅+발행/삭제
supabase/              schema.sql, functions/get-wp-posts, README.md(설정 순서)
scripts/migrate-articles.js  mock.js SEED_ARTICLES → Supabase 1회성 이전 스크립트
```

### 콘텐츠 파이프라인 (신규 — 이번 세션에서 도입, 실제 프로젝트에 연결 완료)
글 목록은 더 이상 코드에 하드코딩하지 않음. 운영자가 `admin/index.html`(정적 페이지)에서 워드프레스(zucca100.com) 글을 불러와 태그(카테고리/상황/지역) 붙이고 발행하면, Supabase `articles` 테이블에 저장되고 앱이 시작 시 자동으로 최신 목록을 가져온다(AsyncStorage 캐시 폴백 포함). 이 작업엔 실시간 푸시 알림은 포함하지 않음(의도적으로 범위 제외 — 사용자가 명시적으로 요청, 나중에 이 스키마 위에 추가 가능하도록만 설계).

**현재 상태 (실제로 붙어있음, mock 아님)**:
- Supabase 프로젝트: `oxunynxspkxfkokerftl` (URL `https://oxunynxspkxfkokerftl.supabase.co`)
- `supabase/schema.sql` 적용 완료 (articles 테이블 + RLS: anon은 published만 read, authenticated는 전체 CRUD)
- 관리자 로그인 계정 생성 완료 (Supabase Authentication, 이메일/비번은 사용자 본인이 앎)
- `.env`(gitignore됨, 커밋 안 됨) + `admin/index.html` 상단에 실제 URL/anon(publishable) key 반영 완료
- 기존 mock 41개 글 → `scripts/migrate-articles.js`로 Supabase에 마이그레이션 완료, `published:true`
- anon key로 REST 조회 검증 완료: `curl .../rest/v1/articles?select=id -H "apikey: <publishable key>"` → `content-range: 0-40/41` 확인됨
- 앱 번들(`npx expo export`) 정상 컴파일 확인, `.env` 로드 로그(`env: load .env`)도 확인됨
- **`get-wp-posts` Edge Function 배포 완료** — `curl .../functions/v1/get-wp-posts`로 실제 워드프레스 최신 글(제목/요약/URL/날짜) 정상 응답 확인됨. `supabase/.temp/`에 CLI 링크 캐시 남아있음(gitignore 처리, 프로젝트가 `oxunynxspkxfkokerftl`에 링크돼 있다는 뜻).
- **어드민 페이지 정식 배포 완료**: https://jiwongum-app-admob.vercel.app/ (Vercel, GitHub `feel2174/jiwongum_app_admob` 리포의 `admin/` 폴더를 Root Directory로 연결 — `main`에 push할 때마다 자동 재배포). 배포된 페이지에서 title/로그인화면/Supabase 설정값 정상 로드 확인됨.

**아직 안 된 것 (다음 작업자가 이어갈 부분)**:
- 어드민 "새 글 가져오기" 탭에서 실제로 워드프레스 글을 선택→태깅→발행까지 해보고, 그 글이 앱(dev client)에서 실제로 보이는지 end-to-end 1회 확인 (Edge Function/DB/RLS/배포는 개별적으로 검증됐지만 어드민 UI를 통한 전체 흐름은 아직 안 눌러봄).

## 6. ⚠️ 절대 건드리지 말 규칙
- **속보 영역(NewsSection / reco.js의 news())**: 향후 뉴스 API로 대체할 전용 슬롯. 지원금 목록과 섞지 말 것.
- **AdMob 버전(16.3.4) / Expo SDK(56)**: 위 사유로 고정.
- **개발 중 실광고 클릭 금지**(밴). 코드가 `__DEV__`에서 테스트 광고로 자동 분기됨 — 이 안전장치 유지.

## 7. 수익화/출시 자산 (준비 완료된 것)
- AdMob 실 ID 반영: 앱ID `ca-app-pub-8785405056367250~4012448499`, 전면 `/3054590041`, 배너 `/3437733426` (Android)
- AdMob 실 ID 반영 (iOS): 앱ID `~1027458434`, 전면 `/9854435134`, 배너 `/1761955604` — `app.json`·`src/lib/adManager.js` 교체 완료
- `app-ads.txt` 생성됨(퍼블리셔 pub-8785405056367250) — **웹 게시 필요**(선택, 나중에)
- 개인정보처리방침(Notion, 공개): https://workable-crowberry-292.notion.site/3993761bd6b28049b341ffc4e1002044
- 앱 아이콘(₩ 마크) + 어댑티브/스플래시, `store/` 스토어 에셋(512 아이콘·피처그래픽·스크린샷 4)
- Play 리스팅 문구·데이터보안 답변: `store/play-listing.md` (개발자명 추천 `Zucca`)

## 8. 남은 할 일 (우선순위순)
- [ ] 어드민에서 실제 워드프레스 글 가져오기 → 태깅 → 발행 → 앱(dev client)에서 보이는지 end-to-end 1회 확인
- [ ] AdMob 계정 **본인 인증** 완료 여부 최종 확인 (콘솔에서 직접 체크)
- [ ] `app-ads.txt` 웹 게시 (선택)
- [ ] **production AAB 빌드**: `eas build -p android --profile production`
- [ ] Play Console: 앱 생성 → `store/play-listing.md`대로 입력 + 에셋 업로드 → (개인계정) 비공개테스트 12명·14일 → 프로덕션
- [ ] (선택) 원격 푸시(FCM) 구축, 지역 매칭 강화, "핫딜" 카테고리와 스토어 리스팅 정합성 정리

### 완료된 것 (참고용)
- [x] iOS AdMob 앱/광고단위 발급 → `app.json`(iosAppId)·`adManager.js`(ios 유닛) 교체
- [x] 콘텐츠 관리 어드민 도구 + Supabase 연동 (스키마·RLS·마이그레이션·Edge Function·앱 리팩터·Vercel 배포) — 위 "콘텐츠 파이프라인" 절 참고
- [x] 어드민 페이지 정식 배포: https://jiwongum-app-admob.vercel.app/ (Vercel, GitHub 연동, push 시 자동 재배포)

## 9. 실행/검증 방법
- 개발: dev build 설치 후 `npx expo start --dev-client` (JS 즉시 반영)
- JS 그래프 검증(기기 없이): `npx expo export -p android --output-dir dist-check` (성공하면 OK, 후 삭제)
- 상세: `TESTING.md`

### 콘텐츠 파이프라인 상태 확인 (다음 작업자용)
- Supabase에 글이 잘 들어있는지(anon 권한으로): `.env`의 `EXPO_PUBLIC_SUPABASE_ANON_KEY` 값으로
  ```
  curl "https://oxunynxspkxfkokerftl.supabase.co/rest/v1/articles?select=id,title,published&limit=5" \
    -H "apikey: <anon/publishable key>" -H "Authorization: Bearer <anon/publishable key>"
  ```
  41개 이상 나오고 `published:true`면 정상.
- 어드민 로컬 실행: `cd admin && python3 -m http.server 5500` → `http://localhost:5500` 접속 → 로그인 → "글 관리" 탭에서 목록 뜨는지 확인. "새 글 가져오기" 탭은 Edge Function 배포 전이면 에러 나는 게 정상(아직 미배포 상태).
- Edge Function 배포 여부 확인: `npx supabase functions list` (링크된 프로젝트 기준)
- ⚠️ `.env`와 `service_role` 키는 어디에도 커밋하지 말 것. `.env`는 이미 `.gitignore`에 있음. `admin/index.html`에 박힌 키는 anon(publishable) 키라 공개돼도 안전(RLS가 실제 접근 제어).

## 10. 참고 문서
- `README.md` 기능/스택 · `TESTING.md` 실행·테스트 · `store/README.md` 에셋 · `store/play-listing.md` 리스팅
- 세션 아티팩트(브라우저): 전략기획서 / 개발기획서 / 프로토타입 / 컨셉 리디자인 v2
