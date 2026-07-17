# Production Build Checklist

이 문서는 `jiwongum` 앱을 production 빌드와 Play Console 출시까지 가져가기 위한 실행 체크리스트입니다.

## 1. 빌드 전 필수 점검

- [ ] `npx expo-doctor`가 통과하는지 확인한다.
- [ ] `react-native-webview`가 dependency에 포함되어 있는지 확인한다. WebView는 네이티브 모듈이므로 dev/prod 앱을 다시 빌드해야 반영된다.
- [ ] 실제 기기에서 development build로 홈, 검색, 저장, 상세, WebView 진입 흐름을 확인한다.
- [ ] WebView 진입 시 `zucca100.com`이 정상 로드되고 앱이 멈추지 않는지 확인한다.
- [ ] `modules/webview-ads`가 Android production 빌드에서 컴파일되는지 확인한다.
- [ ] `.env`와 `*-firebase-adminsdk-*.json` 같은 비공개 파일이 Git에 포함되지 않았는지 확인한다.

## 2. 광고 점검

- [ ] `src/lib/adManager.js`의 production 광고 단위 ID가 실제 AdMob ID인지 확인한다.
- [ ] development/test build에서는 테스트 광고가 나오고, production build에서는 실제 광고 ID가 적용되는지 확인한다.
- [ ] WebView 광고 등록용 alert, debug UI, 임시 로그가 사용자 화면에 나타나지 않는지 확인한다.
- [ ] AdMob 앱 ID가 `app.json`의 `react-native-google-mobile-ads` 플러그인 설정과 일치하는지 확인한다.
- [ ] AdMob 계정 본인 인증, 결제 정보, 앱 등록 상태를 Play 출시 전에 확인한다.
- [ ] `app-ads.txt`를 연결 도메인에 게시하고 AdMob에서 확인 상태를 점검한다.

## 3. 푸시 알림 점검

- [ ] `google-services.json`이 package name `com.jiwongum.app`과 일치하는지 확인한다.
- [ ] EAS Android credentials에 FCM V1 서비스 계정 키가 등록되어 있는지 확인한다.
- [ ] 실제 기기에서 알림 권한 요청, 토큰 저장, 알림 on/off 흐름을 확인한다.
- [ ] Supabase `push_tokens` insert/delete 정책이 실제 앱에서 정상 동작하는지 확인한다.
- [ ] 관리자에서 새 글 발행 후 `notify-new-article` 알림이 실제 기기로 도착하는지 확인한다.
- [ ] 기존 테스트 기기는 앱 삭제 후 재설치해서 Android notification channel 설정을 새로 받는지 확인한다.

## 4. 데이터와 서버 점검

- [ ] Supabase `articles` 테이블에서 published 글만 익명 읽기가 가능한지 확인한다.
- [ ] `get-wp-posts`, `get-breaking-news`, `notify-new-article` Edge Function이 배포되어 있는지 확인한다.
- [ ] 앱 첫 실행, 네트워크 실패, 빈 데이터 상태에서 화면이 깨지지 않는지 확인한다.
- [ ] 관리자 페이지에서 글 발행, 숨김, 가져오기 흐름을 최종 점검한다.

## 5. Play Console 준비

- [ ] 앱 이름, 짧은 설명, 긴 설명을 `store/play-listing.md` 기준으로 입력한다.
- [ ] 앱 아이콘 `store/play-icon-512.png`, feature graphic, 스크린샷 4장을 업로드한다.
- [ ] 개인정보처리방침 URL을 등록한다.
- [ ] Data Safety에서 광고 ID, 앱 활동, 기기 또는 기타 ID 수집 항목을 실제 동작과 맞게 입력한다.
- [ ] 앱에 광고가 있음을 표시한다.
- [ ] 콘텐츠 등급 설문을 완료한다.
- [ ] 대상 연령을 18세 이상 또는 서비스 정책에 맞는 범위로 설정한다.
- [ ] 개인 개발자 계정이면 비공개 테스트 12명/14일 요건을 확인한다.

## 6. Production 빌드

Android AAB 빌드:

```bash
eas build -p android --profile production
```

양쪽 플랫폼 빌드:

```bash
eas build --profile production
```

빌드 후 확인:

- [ ] EAS 빌드 로그에서 WebView, AdMob, Firebase 관련 오류가 없는지 확인한다.
- [ ] 생성된 Android artifact가 APK가 아닌 AAB인지 확인한다.
- [ ] Play Console 내부 테스트 트랙에 먼저 업로드한다.
- [ ] 내부 테스트 앱에서 앱 실행, WebView, 광고, 푸시를 다시 확인한다.

## 7. 출시 직전 최종 확인

- [ ] 앱 버전 `app.json`의 `expo.version`이 출시 버전과 맞는지 확인한다.
- [ ] `eas.json`의 production profile에 테스트 광고 플래그가 없는지 확인한다.
- [ ] Play Console pre-launch report의 crash, ANR, 권한 경고를 확인한다.
- [ ] Supabase와 Vercel 관리자 페이지가 production 데이터 기준으로 동작하는지 확인한다.
- [ ] 출시 후 rollback을 위해 마지막 정상 빌드 ID와 Git commit을 기록한다.

## 8. 현재 프로젝트 기준 메모

- Android package: `com.jiwongum.app`
- EAS projectId: `55a524eb-4738-421c-b9da-9b49729b81b0`
- Production profile: `eas.json`의 `build.production`
- Store assets: `store/`
- Push guide: `PUSH_TESTING.md`
- Store listing draft: `store/play-listing.md`
