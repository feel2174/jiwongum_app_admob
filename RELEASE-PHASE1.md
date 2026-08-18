# Phase 1 (웹 개편) 변경 요약 — 어르신 지원금

`jiwongum.md` 릴리스 계획 중 **Phase 1(웹만)** 을 반영했다. 앱 이름/아이콘(브랜드 전환)은 Phase 3이므로 **app.json 은 건드리지 않았다.** 스토어·앱 아이콘 PNG는 생성만 하고 스테이징 폴더에 두었다.

## 1. 웹 브랜드 교체 (사이트 내부만)
`시니어 서포트` → **`어르신 지원금`**
- `web/app/layout.js` — title/template/description/openGraph + OG 이미지(`/og.png`) 추가
- `web/app/page.js` — 브랜드 킥커, 푸터
- `web/app/help/page.js` — 브랜드 킥커, description

## 2. §1.2 하위 호환 (구버전 앱 + 신버전 웹 공존 대비)
| 규칙 | 처리 |
|---|---|
| 전화번호 텍스트 노출 | 이미 충족 — `SearchClient.js` 가 `📞 {번호} 전화` 로 번호를 텍스트 노출 |
| `target="_blank"` 금지 | 이미 충족 — 인앱 웹뷰 동일창 이동(주석/코드 확인) |
| 앱 감지 부재 정상처리 | 이미 충족 — `window.ReactNativeWebView` 존재 여부로 분기 |
| **하단 여백 100px** | `globals.css` `.landingMain`/`.searchMain` `padding-bottom: calc(100px + safe-area)` 로 상향(기존 40px) |
| **하단 고정 요소** | `.floatingFontControls` 를 `bottom: calc(16px + safe-area)` 로 올려 탭바/홈 인디케이터 위로 이격. ⚠️ 이 플로팅 글자크기 버튼은 시니어 접근성 필수라 제거하지 않고 이격으로 처리 — 구버전 앱 셸이 웹뷰를 탭바 아래로 풀블리드로 그린다면 실기기 확인 필요 |

## 3. 리다이렉트(§1.2 — 옛 경로 301)
`web/next.config.mjs` 에 `redirects()` 추가.
- `/community`, `/community/*` → `/` (permanent 301). 기존 server-component redirect(307)를 영구 301로 승격.
- ⚠️ **`legacyRedirects` 배열을 Search Console/애널리틱스의 실제 옛 URL 로 채워야 완료.** 추측 금지(잘못된 301이 캐시됨). 채운 뒤 404 0건 확인.

## 4. 데이터 보존(§5)
- `localStorage` 키 `senior-font-size` **그대로 유지**(리네임 금지). 코드상 `senior_region` 키는 존재하지 않아 지역 마이그레이션 불필요.
- Supabase 푸시 토큰/테이블 미변경.

## 5. 이미지 (HTML→PNG)
생성기: `tools/brand-assets/template.html` + `render.mjs` (Chrome 헤드리스). 재실행: `node tools/brand-assets/render.mjs`
디자인: 네이비 `#154c76` + 원화(₩) 코인. 기존 팔레트 계승으로 브랜드 전환 충격 최소화.

| 출력 | 크기 | 반영 상태 |
|---|---|---|
| `web/public/og.png` | 1200×630 | **라이브**(Phase 1 사이트 범위) |
| `web/app/icon.png` | 512×512 | **라이브**(Next 파비콘) |
| `assets/rebrand/icon.png` | 1024² | 스테이징 — app.json 미반영(Phase 3) |
| `assets/rebrand/android-icon-foreground/background/monochrome.png` | 1024² | 스테이징 |
| `assets/rebrand/splash-icon.png` | 1024² | 스테이징 |
| `assets/rebrand/notification-icon.png` | 96² | 스테이징 |
| `assets/rebrand/favicon.png` | 256² | 스테이징(Expo web) |
| `store/rebrand/play-icon-512.png` | 512² | 스테이징 — 스토어 제출용 |
| `store/rebrand/feature-graphic.png` | 1024×500 | 스테이징 — 스토어 제출용 |

> 스토어 스크린샷(`store/screenshot-*.png`)은 실제 앱 화면 캡처라 HTML로 재생성하지 않았다. 기능/브랜드 반영 후 실기기에서 다시 촬영해야 한다.

## 후속(미착수 — 별도 지시 대기)
- Phase 0의 Play Integrity 소프트게이트·킬스위치·`skipIntegrity` 는 **코드에 아직 존재하지 않음**(신규 구현 필요).
- 리다이렉트 맵 실제 URL 수집, 배포 후 1주 지표 관찰.
