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
  data/mock.js         41개 글(실 URL) + CATEGORIES/SITUATIONS/REGIONS + NEWS(속보 placeholder)
  lib/
    reco.js            규칙 기반 추천/매칭
    adManager.js       전면광고 밴 방지 캡 (실 AdMob ID 들어있음)
    openLink.js        광고판정 → 시스템 브라우저
    store.js/storage.js 북마크·알림설정·프로필(상황/지역/온보딩) 로컬 저장
    push.js            로컬 알림 데모 (원격 푸시는 향후)
  components/          ArticleCard, SectionHeader, Header, NewsSection
  screens/            Onboarding, Home, Explore, Collection, Search, Saved, Settings, Detail
```

## 6. ⚠️ 절대 건드리지 말 규칙
- **속보 영역(NewsSection / mock.js의 NEWS)**: 향후 뉴스 API로 대체할 전용 슬롯. 지원금 목록과 섞지 말 것.
- **AdMob 버전(16.3.4) / Expo SDK(56)**: 위 사유로 고정.
- **개발 중 실광고 클릭 금지**(밴). 코드가 `__DEV__`에서 테스트 광고로 자동 분기됨 — 이 안전장치 유지.

## 7. 수익화/출시 자산 (준비 완료된 것)
- AdMob 실 ID 반영: 앱ID `ca-app-pub-8785405056367250~4012448499`, 전면 `/3054590041`, 배너 `/3437733426` (Android)
- `app-ads.txt` 생성됨(퍼블리셔 pub-8785405056367250) — **웹 게시 필요**(선택, 나중에)
- 개인정보처리방침(Notion, 공개): https://workable-crowberry-292.notion.site/3993761bd6b28049b341ffc4e1002044
- 앱 아이콘(₩ 마크) + 어댑티브/스플래시, `store/` 스토어 에셋(512 아이콘·피처그래픽·스크린샷 4)
- Play 리스팅 문구·데이터보안 답변: `store/play-listing.md` (개발자명 추천 `Zucca`)

## 8. 남은 할 일
- [ ] AdMob 계정 **본인 인증** 대기 중
- [ ] iOS AdMob 앱/광고단위 발급 → `app.json`(iosAppId)·`adManager.js`(ios 유닛) 교체
- [ ] `app-ads.txt` 웹 게시 (선택)
- [ ] **production AAB 빌드**: `eas build -p android --profile production`
- [ ] Play Console: 앱 생성 → `store/play-listing.md`대로 입력 + 에셋 업로드 → (개인계정) 비공개테스트 12명·14일 → 프로덕션
- [ ] (선택) 콘텐츠 더 보강, 원격 푸시(FCM) 구축, 지역 매칭 강화

## 9. 실행/검증 방법
- 개발: dev build 설치 후 `npx expo start --dev-client` (JS 즉시 반영)
- JS 그래프 검증(기기 없이): `npx expo export -p android --output-dir dist-check` (성공하면 OK, 후 삭제)
- 상세: `TESTING.md`

## 10. 참고 문서
- `README.md` 기능/스택 · `TESTING.md` 실행·테스트 · `store/README.md` 에셋 · `store/play-listing.md` 리스팅
- 세션 아티팩트(브라우저): 전략기획서 / 개발기획서 / 프로토타입 / 컨셉 리디자인 v2
