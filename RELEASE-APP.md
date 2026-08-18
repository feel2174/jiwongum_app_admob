# 앱 내부 변경 요약 (Phase 2 기능 + Phase 0 안전장치)

`jiwongum.md` 중 앱 관련 항목을 구현했다. **JS 번들 검증 완료**(`npx expo export --platform android` → 1111 modules, 오류 0).
브랜드 전환(이름/아이콘)은 **dev/preview 빌드에서만** 새 브랜드로 뜨고, **production 빌드는 구브랜드를 유지**한다(§Phase3 편도 변경 보호).

## 1. 하단 탭바 교체 (3 → 4탭)
`App.js` — 홈 / **저장함(⭐, 신규)** / 문의 / 설정. `SavedScreen`(기존 미연결)을 탭으로 연결.
> 저장함은 네이티브 글 북마크(★)를 모아 보여준다. 웹뷰에서 본 혜택을 저장하려면 웹→네이티브 postMessage 연동이 추가로 필요(후속).

## 2. Play Integrity 소프트 게이트 (§2) — `src/lib/integrity.js`
- **콘텐츠는 어떤 판정에서도 막지 않는다.** 판정은 광고만 좌우.
- 콜드 스타트 1회 검증, 결과 24h 캐시(`AsyncStorage`), 화면/탭마다 재검증 없음.
- 무결성 관련 화면을 사용자에게 노출하지 않음.
- `SKIP_INTEGRITY = __DEV__ || extra.skipIntegrity` → 개발/프리뷰는 검증 스킵(디버그 서명은 항상 UNRECOGNIZED).
- ⚠️ **네이티브 Play Integrity 모듈은 아직 없음.** `runNativeIntegrity()` 가 연결 지점이며, 현재는 `'unavailable'`(광고 허용측)을 반환해 **라이브 수익을 깨지 않는다.** 모듈 연결 시 `PLAY_RECOGNIZED+MEETS_DEVICE_INTEGRITY→'ok'`, 그 외→`'failed'`(광고만 off) 로 매핑하면 된다.

## 3. 원격 설정 / 킬 스위치 (§7) — `src/lib/remoteConfig.js`
- Supabase `app_settings` 테이블의 `app_config` 키를 부팅 시 1회 조회(캐시 폴백, 실패 시 안전 기본값).
- 제어 항목: `adsEnabled`, `maintenance{title,message}`, `transitionNotice`.
- 마이그레이션: `supabase/migrations/20260818000100_add_app_config.sql`.

### 운영 방법 (SQL)
```sql
-- 광고 끄기 (앱 배포 없이 즉시)
update app_settings set value = jsonb_set(value,'{adsEnabled}','false'), updated_at=now() where key='app_config';
-- 점검 공지 배너
update app_settings set value = jsonb_set(value,'{maintenance}','{"title":"점검 중","message":"잠시 뒤 다시 열어보세요"}') where key='app_config';
-- 브랜드 전환 안내 모달 켜기 (Phase 3 시점)
update app_settings set value = jsonb_set(value,'{transitionNotice}','true') where key='app_config';
```

## 4. 광고 소프트 게이트 배선 — `src/lib/adManager.js`, `src/screens/WebScreen.js`
- `adsEnabled` 스위치 추가(`setAdsEnabled`/`areAdsEnabled`). 전면광고 게이트가 이를 확인.
- 광고 off 시 웹뷰를 광고 SDK에 등록하지 않음(콘텐츠는 정상 로드).
- `App.js` 부팅: `adsEnabled = remote.adsEnabled && adsAllowedByIntegrity(verdict)`.

## 5. `tel:`/`sms:`/`mailto:` 처리 (§Phase2) — `src/screens/WebScreen.js`
- 웹뷰가 처리 못 하는 스킴을 `onShouldStartLoadWithRequest` 로 가로채 OS 다이얼러/앱에 넘김.

## 6. 브랜드 전환 안내 모달 (§4.2) — `src/components/RemoteNotices.js`
- Phase 2 빌드에 **미리 심어둠**, Phase 3에 원격 플래그(`transitionNotice`)로 켬.
- 1회만 노출(`AsyncStorage` 플래그), 닫기 버튼은 `X`가 아니라 **`알겠어요`** 텍스트 버튼.
- 점검 공지 배너도 같은 컴포넌트에서 처리(비차단 상단 배너).

## 7. 브랜드/스플래시 — `app.config.js`, `src/components/AppSplash.js`
- `app.config.js`: EAS 프로파일별 `skipIntegrity` 주입 + 브랜드 게이트.
  - dev/preview → 새 브랜드(`어르신 지원금`, `assets/rebrand/*`), `skipIntegrity=true`
  - production → 구브랜드 유지, `skipIntegrity=false`. 새 브랜드 내보내려면 `EXPO_PUBLIC_REBRAND=1`.
- `AppSplash.js`: 코드 스플래시를 네이비 코인(₩) + `어르신 지원금` 으로 교체(노란 배경 유지).

---

## dev 모드 빌드 & 테스트 (실기기/에뮬레이터에서)
이 환경엔 Android SDK가 없어 네이티브 빌드는 로컬에서 실행해야 한다.
```bash
# 개발 클라이언트(네이티브) 빌드 — 기기/에뮬레이터 연결 필요
npx expo run:android            # 로컬 SDK로 빌드+설치
# 또는 EAS 개발 빌드
eas build --profile development --platform android
```

### 테스트 체크리스트
- [ ] 하단 4탭 표시(홈/저장함/문의/설정), 각 탭 전환 정상
- [ ] 홈/문의 웹뷰 로드, 전화번호 링크 탭 → OS 다이얼러 열림(`tel:`)
- [ ] 스플래시가 `어르신 지원금` 코인으로 표시, 앱 이름/아이콘이 새 브랜드
- [ ] 비행기 모드에서 웹뷰 오류 화면 → 다시 시도 동작
- [ ] 광고: dev 는 테스트 광고. `app_config.adsEnabled=false` 로 바꾸고 재실행 시 전면광고 미노출
- [ ] `app_config.transitionNotice=true` → 첫 실행 시 전환 안내 모달 1회, 재실행 시 미노출
- [ ] `app_config.maintenance` 설정 → 상단 점검 배너 노출
