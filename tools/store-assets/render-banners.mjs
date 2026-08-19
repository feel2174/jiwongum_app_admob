// html5/ 배너 템플릿을 정적 PNG로 렌더 (Google Ads는 순수 HTML5 zip 업로드를
// Google Web Designer 산출물만 인정해서, 같은 디자인을 이미지 광고로 대체하기 위함)
// 사용:  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node tools/store-assets/render-banners.mjs
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

const SIZES = ['300x250', '320x50', '728x90'];
const outDir = join(repo, 'outputs', 'ads', 'images', 'banners');
mkdirSync(outDir, { recursive: true });

for (const size of SIZES) {
  const [w, h] = size.split('x');
  const htmlPath = join(here, 'html5', size, 'index.html');
  const outPath = join(outDir, `banner-${size}.png`);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w},${h}`,
    `--screenshot=${outPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });
  console.log(`✓ outputs/ads/images/banners/banner-${size}.png`);
}
console.log('\n완료.');
