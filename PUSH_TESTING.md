# 푸시 알림 설정 & 테스트 가이드

## 이미 세팅된 것 (코드/설정) ✅
- **Android POST_NOTIFICATIONS 권한** — `app.json` 선언 + `expo-notifications` 플러그인 (prebuild 매니페스트로 검증됨)
- **알림 아이콘** — `assets/notification-icon.png`(흰 ₩ 실루엣) + 색 `#154c76`
- **권한 요청 흐름** — 설정 → "새 글 알림" 켤 때 OS 권한 요청(opt-in), 거부 시 자동 원복
- **알림 채널** — Android 'default' (`src/lib/push.js`)
- **토큰 등록/해제** — 켜면 `push_tokens`에 등록, 끄면 삭제
- **탭 동작** — 알림 탭 시 `data.url`/`data.articleId`로 해당 글 이동 (`App.js`)

## ⚠️ 반드시 먼저 — FCM 자격증명 (Android 원격 푸시의 전제)
Expo 푸시 서비스는 Android 전송을 위해 **네 Firebase(FCM) 자격증명**이 필요해.
없으면 토큰은 발급되지만 **알림이 기기에 도착하지 않음**.

**설정 (1회):**
1. [Firebase 콘솔](https://console.firebase.google.com) → 프로젝트 생성(또는 기존) → **Android 앱 추가**, 패키지명 `com.jiwongum.app`
2. 프로젝트 설정 → **서비스 계정** → **새 비공개 키 생성** → JSON 다운로드
3. Expo에 업로드:
   ```
   eas credentials
   # Android → 빌드 프로필 선택 → Push Notifications: FCM V1 → 서비스 계정 키(JSON) 업로드
   ```
   (또는 expo.dev 대시보드 → 프로젝트 → Credentials → FCM V1)
4. 이후 **빌드를 다시 해야** 반영됨.

## 빌드
```
eas build --profile development --platform android   # 또는 preview (Metro 불필요)
```

## 테스트 방법 A — Expo 푸시 도구 (가장 빠름)
1. 앱 실행 → **설정 → "새 글 알림" 켜기** (권한 허용)
2. **토큰 확인**: Metro 콘솔 또는 `adb logcat | findstr "Expo push token"` → `ExponentPushToken[...]` 복사
3. [expo.dev/notifications](https://expo.dev/notifications) → **To**에 토큰 붙여넣기 → Title/Body 입력 → **Send**
4. 기기에 알림 오면 성공 ✅

## 테스트 방법 B — 실제 흐름 (end-to-end)
1. 기기에서 알림 켜기
2. [어드민](https://jiwongum-app-admob.vercel.app/)에서 글 **발행**
3. → `notify-new-article`이 `push_tokens` 전체에 발송 → 기기에 **[새 글]** 알림 도착
4. 탭 → 해당 글로 이동

## iOS (나중에)
- **APNs 키** 필요 (Apple Developer 계정 $99). `eas credentials` → iOS → Push Key 설정.
- Android 먼저 검증 후 진행 권장.

## 트러블슈팅
- 토큰은 나오는데 알림이 안 옴 → **FCM 자격증명 미설정**(위 필수 단계) 또는 그 후 재빌드 안 함
- "알림 권한이 필요해요" 팝업 → 기기 설정에서 앱 알림 허용 후 다시 토글
- 어드민 발행했는데 안 옴 → 기기에서 알림을 실제로 켜서 `push_tokens`에 토큰이 등록됐는지 확인
