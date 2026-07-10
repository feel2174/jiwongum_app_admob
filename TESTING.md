# 실행 & 테스트 가이드

이 앱은 **AdMob 네이티브 모듈** 때문에 **Expo Go로 실행할 수 없습니다.**
"Dev Build(개발용 클라이언트 앱)"를 **한 번만** 만들어 기기에 설치하면,
그 다음부터는 JS 수정이 **즉시 새로고침**됩니다.

```
[1회] Dev Build 생성 → 기기에 설치        (네이티브 의존성 안 바뀌면 다시 안 함)
[매번] npx expo start --dev-client  →  JS 즉시 반영
```

---

## 경로 A — EAS 클라우드 빌드 (Windows 권장 · 로컬 SDK 불필요)

Android Studio 설치 없이 클라우드에서 빌드합니다. Expo 무료 계정 필요.

### 1) 준비
```bash
npm install -g eas-cli
eas login                 # Expo 계정 로그인 (없으면 expo.dev에서 가입)
```

### 2) 안드로이드 Dev Build 생성
```bash
cd C:/Users/devzu/Documents/starter
eas build --profile development --platform android
```
- 처음 실행하면 프로젝트 등록 + 안드로이드 keystore 자동 생성 여부를 물어봅니다 → **Yes**.
- 클라우드 빌드가 끝나면 **APK 다운로드 링크/QR**이 나옵니다 (보통 5~15분).

### 3) 기기에 설치
- 안드로이드 폰에서 그 링크를 열어 APK 다운로드 → 설치
  (설정에서 "출처를 알 수 없는 앱 설치" 허용 필요).

### 4) 개발 서버 연결
```bash
npx expo start --dev-client
```
- 폰과 PC를 **같은 Wi-Fi**에 두고, 설치된 "지원금 모아보기(dev)" 앱을 열어
  화면의 QR을 스캔하거나 목록에서 서버를 선택.
- 이제 코드를 저장하면 앱이 자동 새로고침됩니다.

> Wi-Fi가 다르거나 회사망이면: `npx expo start --dev-client --tunnel`

---

## 경로 B — 로컬 안드로이드 빌드 (Android Studio 필요)

클라우드를 안 쓰고 PC에서 바로 빌드/설치합니다.

### 1) 사전 설치 (최초 1회)
- **Android Studio** 설치 → SDK Manager에서 `Android SDK` + `Platform-Tools` 설치
- 환경변수 설정 (PowerShell, 재시작 후 적용):
  ```powershell
  setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
  setx PATH "$env:PATH;$env:LOCALAPPDATA\Android\Sdk\platform-tools"
  ```
- **JDK 17** 필요 (Android Studio 내장 JDK 사용 가능)

### 2) 기기 또는 에뮬레이터 준비
- **실기기**: 폰에서 `설정 → 개발자 옵션 → USB 디버깅` 켜고 USB 연결
  - 확인: `adb devices` 에 기기가 보이면 OK
- **에뮬레이터**: Android Studio → Device Manager에서 가상기기 실행

### 3) 빌드 + 설치 + 실행 (한 방)
```bash
cd C:/Users/devzu/Documents/starter
npx expo run:android
```
- Gradle 빌드 후 자동으로 앱 설치·실행되고 Metro가 뜹니다.
- 이후 JS 수정은 자동 반영. 네이티브 의존성 바꿀 때만 이 명령 재실행.

---

## 경로 C — iOS

- iOS 빌드는 **macOS 또는 EAS 클라우드**가 필요합니다. Windows 로컬 빌드는 불가.
- 실기기 설치는 **Apple Developer 계정($99/년)** 필요:
  ```bash
  eas build --profile development --platform ios
  ```
- Mac이 없다면 iOS는 뒤로 미루고 Android로 먼저 검증하는 걸 권장.

---

## ✅ 테스트 체크리스트 (기능별)

### 1. 광고 (핵심)
- 홈 리스트 2번째 카드 뒤 **배너 광고**에 "Test Ad" 표기가 보이는지
- 상세 **"자세히 보기"** 를 눌렀을 때:
  - 상세를 **3번 미만** 봤으면 → 광고 없이 바로 브라우저
  - 상세 **3개 이상** 본 뒤 → **전면광고** 노출 → 닫으면 브라우저
  - 바로 또 누르면 → **90초 안 지났으므로** 광고 없이 브라우저
  - 브라우저에서 복귀 시 → 광고 없음(억제)
- ⚠️ 테스트 ID라 "Test Ad"가 떠야 정상. **실광고 ID로 바꾼 뒤 자기 광고 클릭은 절대 금지**(계정 밴).

> 광고 캡을 빠르게 확인하려면 `src/lib/adManager.js`의 `CAPS`를
> 임시로 `VIEW_MIN: 1, INTERVAL_MS: 0` 으로 낮춰 테스트 후 원복하세요.

### 2. 브라우저 연동
- "자세히 보기" / 속보 뉴스 탭 → 시스템 인앱 브라우저로 원문이 열리는지
- 뒤로 가면 앱으로 정상 복귀하는지

### 3. 푸시 재진입 루프
- 알림 탭 → "🔔 [속보] 테스트 푸시 보내기" → (iOS면 권한 허용)
- **앱을 백그라운드로 내린 뒤** 몇 초 후 도착한 알림을 탭
- → 앱으로 다시 들어와 기사 원문이 열리면 성공

### 4. 저장 & 지속성
- 지원금 ☆ 저장 → 저장함 탭에 뜨는지, D-day 순 정렬되는지
- **앱을 완전히 종료 후 재실행** → 저장 목록이 유지되는지(로컬 저장 확인)

### 5. 기타
- 검색어 입력 + "마감임박" 필터 동작
- 시스템 다크모드 전환 시 앱 색상 반응
- iOS: 첫 실행 시 ATT(추적 허용) 팝업이 뜨는지

---

## 로그 & 문제 해결

- **JS 로그 보기**: `npx expo start --dev-client` 실행 중인 터미널에 콘솔 출력
- **네이티브 크래시 로그**(안드로이드): `adb logcat *:E` 또는 Android Studio Logcat
- 자주 겪는 문제:
  - *Expo Go에서 열려다 크래시* → Dev Build 앱으로 열어야 함
  - *"No development build installed"* → 경로 A/B로 Dev Build 먼저 설치
  - *광고가 안 뜸* → 실기기에서만 안정적으로 표시됨. 초기 로드에 몇 초 걸림
  - *폰이 서버를 못 찾음* → 같은 Wi-Fi 확인 또는 `--tunnel` 옵션
