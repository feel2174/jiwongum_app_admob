# 지원금 모아보기 (MVP)

정부 지원금·정책 정보를 큐레이션해서 보여주고, 원문은 시스템 브라우저로 연결하는 앱.
프로토타입에서 합의한 기능만 구현한 최소 버전입니다.

## 구현된 기능

- **홈** — 속보/정책 뉴스 섹션 + 카테고리 필터 + 지원금 리스트 + 리스트 중간 배너 광고
- **검색** — 키워드 검색 + 마감임박 필터
- **저장함** — 북마크(기기 로컬 저장) + D-day 정렬
- **알림 설정** — 카테고리 토글 + `[속보]` 테스트 푸시 → 탭 시 앱 재진입 → 기사 원문
- **상세** — 요약 카드 + "자세히 보기" → **AdManager 판정** 후 시스템 브라우저로 원문(웹·AdSense)
- **AdManager** — 전면광고 밴 방지 캡을 한 곳에서 강제 (조회 3회 이후 / 최소 90초 간격 / 세션 4회 / 복귀 시 억제)

## ⚠️ Expo Go로는 실행되지 않습니다

AdMob(`react-native-google-mobile-ads`)이 네이티브 모듈이라 **Expo Go에서 크래시**합니다.
반드시 **Dev Build**로 실행하세요.

```bash
# 방법 A) 로컬 (Android Studio / Xcode 필요)
npx expo run:android
npx expo run:ios      # macOS

# 방법 B) EAS (클라우드 빌드, 로컬 SDK 불필요)
npm i -g eas-cli
eas login
eas build --profile development --platform android
# 설치 후:
npx expo start --dev-client
```

## 나중에 교체할 지점 (TODO)

| 무엇 | 파일 | 현재 |
|---|---|---|
| 지원금·뉴스 데이터 | `src/data/mock.js` | 목데이터 (API 응답 형태 동일) |
| 실제 광고 단위 ID | `src/lib/adManager.js` | `__DEV__`에서 테스트 ID |
| 실제 AdMob 앱 ID | `app.json` (플러그인 옵션) | Google 샘플 테스트 ID |
| 원격 푸시(FCM/APNs+서버) | `src/lib/push.js` | 로컬 알림 데모로 대체 |

## 폴더 구조

```
App.js                      # 네비게이션 + 광고 초기화 + 푸시 탭 핸들러
src/
  theme.js                  # 라이트/다크 팔레트
  data/mock.js              # 목데이터 + D-day 계산
  lib/
    adManager.js            # 전면광고 밴 방지 캡 (단일 관문)
    openLink.js             # 광고 판정 → 시스템 브라우저
    store.js / storage.js   # 북마크·설정 로컬 저장
    push.js                 # 로컬 알림 데모
  components/               # Header, Chips, SubsidyCard, NewsSection
  screens/                  # Home, Search, Saved, Notifications, Detail
```

## 컴플라이언스 메모 (코드에 반영됨)

- 앱은 원문을 **WebView로 임베드하지 않고** 시스템 브라우저로 오픈 (AdSense 정책 준수)
- 뉴스는 **제목+출처+링크아웃만**, 전문 재게시 금지
- 정부 공식 앱으로 오인되지 않도록 이름·아이콘 주의 (제3자 큐레이션 톤)
- 배포 전 개인정보처리방침 URL, ATT/UMP 동의, Data Safety/Privacy 라벨 준비 필요
