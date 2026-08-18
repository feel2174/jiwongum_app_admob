// HTML → PNG 브랜드 이미지 생성기 (Chrome 헤드리스)
// 사용:  node tools/brand-assets/render.mjs
// 재현 가능하도록 저장소에 보관. template.html 을 ?v=<변형> 으로 렌더한다.
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const template = join(here, 'template.html');

// Chrome 실행 파일 탐색
const CHROME_CANDIDATES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome 실행 파일을 찾지 못했습니다. CHROME 환경변수로 지정하세요.');
  process.exit(1);
}

// [변형, 폭, 높이, 출력경로(저장소 상대), 투명여부]
const SPECS = [
  // 앱 아이콘/스플래시 — 스테이징(assets/rebrand). app.json 반영은 Phase 3 승인 후.
  ['icon',        1024, 1024, 'assets/rebrand/icon.png',                     false],
  ['foreground',  1024, 1024, 'assets/rebrand/android-icon-foreground.png',  true],
  ['background',  1024, 1024, 'assets/rebrand/android-icon-background.png',  false],
  ['mono',        1024, 1024, 'assets/rebrand/android-icon-monochrome.png',  true],
  ['splash',      1024, 1024, 'assets/rebrand/splash-icon.png',              true],
  ['notification',  96,   96, 'assets/rebrand/notification-icon.png',        true],
  ['icon',         256,  256, 'assets/rebrand/favicon.png',                  false],
  // 스토어 리스팅 — 스테이징(store/rebrand).
  ['icon',         512,  512, 'store/rebrand/play-icon-512.png',             false],
  ['feature',     1024,  500, 'store/rebrand/feature-graphic.png',           false],
  // 웹 — Phase 1 사이트 범위. 바로 반영.
  ['og',          1200,  630, 'web/public/og.png',                           false],
  ['icon',         512,  512, 'web/app/icon.png',                            false],
];

function render([variant, w, h, out, transparent]) {
  const outPath = join(repo, out);
  mkdirSync(dirname(outPath), { recursive: true });
  const url = `${pathToFileURL(template).href}?v=${variant}`;
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w},${h}`,
    `--screenshot=${outPath}`,
  ];
  if (transparent) args.push('--default-background-color=00000000');
  args.push(url);
  execFileSync(chrome, args, { stdio: 'ignore' });
  console.log(`✓ ${out}  (${variant} ${w}×${h}${transparent ? ' alpha' : ''})`);
}

console.log(`Chrome: ${chrome}\n`);
for (const spec of SPECS) render(spec);
console.log('\n완료. 앱 아이콘은 assets/rebrand/ 에 스테이징됨(app.json 반영은 Phase 3 승인 후).');
