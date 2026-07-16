# HANDOFF — 지원금 모아보기 (인수인계 · as of 2026-07-13)

> 다른 PC/세션에서 이어갈 때 **이 파일을 먼저 읽어** 맥락 복원. "HANDOFF.md 읽고 이어서 해줘" 한마디면 됨.
> 저장소: https://github.com/feel2174/jiwongum_app_admob (main). 세부는 `README.md`/`TESTING.md`/`PUSH_TESTING.md`/`store/` 참고.

---

## 1. 한 줄 요약
정부 **지원금·정책**을 상황(대상)별로 **맞춤 추천**하는 React Native(Expo) 앱. 콘텐츠는 운영자 워드프레스(zucca100.com) 글을 어드민에서 큐레이션 → Supabase → 앱. 앱=AdMob, 웹=AdSense 이중 수익.

## 2. 핵심 컨셉
- "모든 지원금 목록"이 아니라 **"내가 받을 수 있는 지원금을 골라주는"** 앱.
- 각 글에 **상황 태그**(청년/신혼·육아/구직·취업/주거/시니어/소상공인/저소득·복지) → 온보딩 프로필과 **규칙 기반 매칭**으로 개인화.
- 탭: **홈(맞춤)·탐색(상황별 컬렉션)·검색(패싯)·저장** + 홈 ⚙설정. 첫 실행 온보딩(건너뛰기 가능).

## 3. 수익 모델 (2026-07-13 피벗: WebView API for Ads)
- **앱 네이티브 영역 = AdMob**(배너+전면광고) + **인앱 WebView = zucca100.com(AdSense)**.
- 핵심: Google 공식 **WebView API for Ads**(https://developers.google.com/admob/android/browser/webview/api-for-ads)로 WebView를 SDK에 등록 → WebView 안 AdSense가 **합법** 노출. (미등록 일반 WebView에 AdSense는 여전히 위반 — 등록이 필수 조건)
- 구현: `modules/webview-ads`(로컬 Expo 모듈, Kotlin)가 `MobileAds.registerWebView()` 호출. `src/screens/WebScreen.js`가 Google 권장 설정(JS·DOM Storage·서드파티쿠키·미디어 자동재생)으로 로드하되 **등록 후에 URL 로드**(about:blank → 등록 → 실제 URL). play-services-ads **25.0.0 고정**(25.4.0=Kotlin2.3 금지).
- 라우팅(`openLink.js`): zucca100.com → 인앱 WebView / 그 외(네이버 뉴스 등) → 외부 브라우저. 이전 보조금24 리다이렉트는 **제거**됨.
- 주의: AdMob 네이티브 광고와 WebView 내 AdSense가 **혼동되는 배치 금지**(정책). 앱/웹 **동의(CMP)는 자동 공유 안 됨** — 웹사이트 쪽 동의 플로우 별도(추후). Play Integrity는 Play Console 쪽 적용됨(사용자 확인), 앱 내 Integrity API 검증은 추후 서버 검증과 함께.
- 전면광고 밴 방지 캡: `src/lib/adManager.js` `CAPS`(조회 3회 후 / 90초 간격 / 세션 4회 / 복귀 억제).

## 4. 기술 스택 / 버전 (⚠️ 올리지 말 것)
- **Expo SDK 56 / React Native 0.85.3** (SDK 57은 AdMob 미지원 → 다운그레이드함)
- **react-native-google-mobile-ads 16.3.4** (16.4.0은 play-services-ads 25.4.0=Kotlin 2.3.0 빌드실패 → 16.3.4 고정)
- React Navigation v7, @supabase/supabase-js, expo-notifications, expo-web-browser, expo-tracking-transparency, expo-splash-screen, expo-constants
- ⚠️ **Expo Go 실행 불가**(AdMob 네이티브). Dev/preview build 필요.

## 5. 코드 구조
```
App.js                루트 네비 + 온보딩 게이트 + 탭/스택 + 광고init + 앱실행 알림권한 체크 + 푸시탭 핸들러
src/
  theme.js            라이트/다크 팔레트 + shadow
  data/mock.js        CATEGORIES/SITUATIONS/REGIONS + SEED_ARTICLES(오프라인 폴백)
  lib/
    supabase.js       supabase 클라이언트 (EXPO_PUBLIC_SUPABASE_URL/ANON_KEY)
    content.js        fetchArticles() — Supabase published 글 조회
    breakingNews.js   fetchBreakingNews() — get-breaking-news(네이버) 호출, query='속보'
    reco.js           규칙 기반 추천/매칭 (articles 인자로 받는 순수함수) + news() 폴백
    adManager.js      전면광고 밴 방지 캡 (실 AdMob ID)
    openLink.js       광고판정 → 외부 브라우저(Linking)
    push.js           알림 권한/토큰 등록·해제, 채널 HIGH(헤드업)
    store.js/storage.js  북마크·설정·프로필·articles·breakingNews 상태+캐시
  components/         ArticleCard, SectionHeader, Header, NewsSection(속보 3줄 티커)
  screens/           Onboarding, Home, Explore, Collection, Search, Saved, Settings, Detail
admin/index.html     콘텐츠 관리 어드민(정적) — WP 글 가져오기+태깅+발행+발행시 푸시
supabase/            schema.sql, functions/{get-wp-posts, get-breaking-news, notify-new-article}
google-services.json FCM 클라이언트 config (project: jiwongum, 커밋됨)
```

## 6. 콘텐츠 파이프라인 (완료·가동중)
- Supabase 프로젝트 `oxunynxspkxfkokerftl` (URL https://oxunynxspkxfkokerftl.supabase.co)
- `articles` 테이블 + RLS(anon=published read, authenticated=CRUD). 기존 41개 마이그레이션됨.
- 어드민 배포: https://jiwongum-app-admob.vercel.app/ (Vercel, `admin/` 폴더, main push 시 자동 재배포)
- Edge Function 배포됨: `get-wp-posts`, `get-breaking-news`, `notify-new-article` (모두 ACTIVE)
- 앱은 시작 시 Supabase에서 글/속보 fetch, 실패 시 SEED/placeholder 폴백(캐시 포함)

## 7. 푸시 알림 (✅ 완료·실기기 검증됨)
**동작**: 앱에서 알림 켜기 → Expo 토큰을 `push_tokens`에 저장 → 어드민 발행 시 `notify-new-article`이 전체 브로드캐스트 → 기기 도착 → 탭 시 해당 글.
- **FCM**: google-services.json(앱, project jiwongum) + FCM V1 서비스계정키(eas credentials 업로드됨). 둘 다 완료.
- **push_tokens RLS**: insert/delete `to public`(anon 등록 허용). ⚠️ 이게 없으면 "0명"/RLS 에러 — schema.sql 참고.
- **권한**: 첫 실행(온보딩 후) 팝업 요청(App.js), 설정 토글로 on/off(opt-in). POST_NOTIFICATIONS 선언됨.
- **알림 내용**: title=글 제목, body="지금 바로 확인하세요". 채널 중요도 HIGH + priority high → 헤드업(플로팅).
- ⚠️ **notify-new-article은 코드 변경 후 재배포 안 됨** — title/body·priority 반영하려면 재배포 필요(8절).
- ⚠️ **헤드업**: Android는 한번 만든 채널 중요도를 못 올림 → 기존 설치기기는 **삭제 후 재설치**해야 HIGH 적용. 신규 설치자는 자동 HIGH.

## 8. ⚠️ 절대 규칙 / 재배포 필요한 것
- **버전 고정**: Expo SDK 56 / RN 0.85.3 / AdMob 16.3.4. 올리지 말 것.
- **속보 영역**: 네이버 뉴스 전용 슬롯. 지원금 목록과 섞지 말 것.
- **개발 중 실광고 클릭 금지**(밴). `__DEV__`에서 테스트 광고 자동 분기 — 유지.
- **비밀키 커밋 금지**: `*-firebase-adminsdk-*.json`(서비스계정키), `.env` 는 gitignore됨. `admin/index.html`·`eas.json`의 키는 anon publishable(공개 안전).
- **Edge Function 재배포**(로컬 파일만 바뀜, DB엔 미반영): `npx supabase login` 후
  `npx supabase functions deploy notify-new-article --project-ref oxunynxspkxfkokerftl`
  (또는 Supabase 대시보드 Edge Functions 편집기에 붙여넣고 Deploy)

## 9. 릴리스 자산 (완료)
- 앱 아이콘(₩)/어댑티브/스플래시/알림아이콘(흰 ₩)
- AdMob 실 ID: Android 앱 `~4012448499`(전면 `/3054590041`, 배너 `/3437733426`), iOS 앱 `~1027458434`(전면 `/9854435134`, 배너 `/1761955604`) — app.json·adManager.js 반영
- `app-ads.txt`(pub-8785405056367250) 생성 — **웹 게시 필요**(선택)
- 개인정보처리방침(Notion 공개): https://workable-crowberry-292.notion.site/3993761bd6b28049b341ffc4e1002044
- `store/` : play-icon-512, feature-graphic, screenshot-1~4, **play-listing.md**(개발자명 `Zucca`·설명·데이터보안 답변)
- 배포 전 디버그 제거 완료(푸시 토큰 진단 UI·토큰 로그·미사용 함수)

## 10. 남은 할 일 (우선순위순)
- [ ] **(피벗 검증) 재빌드 후 WebView 광고 확인** — `modules/webview-ads` Kotlin은 EAS 빌드에서 첫 컴파일됨(로컬 SDK 없어 미검증). 빌드 실패 시 gradle 로그 확인. 성공 시: 상세→자세히보기→인앱 WebView에서 zucca100.com 로드 + AdSense 노출 확인
- [ ] **notify-new-article 재배포** (title/body·헤드업 priority 반영) — 8절 방법
- [ ] **EAS 무료 빌드 소진** — 이번 달 Android 빌드 다 씀, **2026-08-01 리셋**. 선택지: ①대기(무료) ②로컬 빌드(무료, Android SDK+JDK17+키스토어) ③EAS 구독(유료)
- [ ] **production AAB 빌드**: `eas build -p android --profile production` (위 빌드 한도 때문에 대기/로컬)
- [ ] **기존 테스트 기기 삭제 후 재설치** → 헤드업 알림 확인
- [ ] **Play Console**: 앱 생성 → `store/play-listing.md`대로 입력 + 에셋 업로드 → 데이터보안·콘텐츠등급·광고=예 → (개인계정) **비공개 테스트 12명·14일** → 프로덕션
- [ ] **AdMob 계정 본인인증** 완료 여부 콘솔 확인
- [ ] `app-ads.txt` 웹 게시 (선택)
- [ ] **iOS**: APNs 키(Apple 계정) → 푸시, iOS 빌드 (Android 먼저 권장)

## 11. 실행 / 검증
- 개발: dev build 설치 후 `npx expo start --dev-client` (JS 즉시 반영)
- JS 그래프 검증(기기 없이): `npx expo export -p android --output-dir dist-check` → 후 삭제
- 푸시 테스트 상세: `PUSH_TESTING.md` (Expo 푸시 도구 / 어드민 발행 흐름)
- Supabase 글 확인: `curl ".../rest/v1/articles?select=id,title,published&limit=5" -H "apikey: <anon>"`

## 12. 외부 설정값 참고 (비밀 아닌 것만)
- Supabase project: `oxunynxspkxfkokerftl` / anon(publishable): `sb_publishable_T_IYdewX-mBILr-5hSIUxw_0KC4f3Nh`
- Firebase project: `jiwongum` (google-services.json)
- AdMob publisher: `pub-8785405056367250` / AdSense(web) publisher: `ca-pub-9196149361612087`
- 네이버 뉴스 API: Supabase secrets(NAVER_CLIENT_ID/SECRET)에 설정됨
- 패키지/번들 ID: `com.jiwongum.app` / EAS projectId: `55a524eb-4738-421c-b9da-9b49729b81b0`
