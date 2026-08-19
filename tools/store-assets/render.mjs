// 스토어/광고용 기능 소개 슬라이드 HTML → PNG (Chrome 헤드리스)
// 사용:  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node tools/store-assets/render.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].filter(Boolean);
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome 실행 파일을 찾지 못했습니다. CHROME 환경변수로 지정하세요.');
  process.exit(1);
}

const SLIDES = ['voice', 'call', 'region', 'fields', 'trust'];

function renderSet(template, w, h, outDir, prefix) {
  mkdirSync(outDir, { recursive: true });
  for (const slide of SLIDES) {
    const outPath = join(outDir, `${prefix}${slide}.png`);
    const url = `${pathToFileURL(template).href}?slide=${slide}`;
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${w},${h}`,
      `--screenshot=${outPath}`,
      url,
    ], { stdio: 'ignore' });
    console.log(`✓ ${outPath.replace(repo + '/', '')}`);
  }
}

renderSet(join(here, 'feature-slides.html'), 1080, 1920, join(repo, 'store', 'rebrand', 'screenshots'), '');
renderSet(join(here, 'feature-slides-landscape.html'), 1920, 1080, join(repo, 'store', 'rebrand', 'screenshots-landscape'), '');

console.log('\n완료.');
