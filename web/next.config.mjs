import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const webRoot = dirname(fileURLToPath(import.meta.url));

// 릴리스 계획 §1.2 / Phase 1: 구버전 앱·푸시·카톡 공유 링크가 옛 경로를 가리키므로
// 경로를 삭제하지 말고 301(permanent)로 신규 구조에 매핑한다. 404가 하나도 나지 않아야 한다.
// ⚠️ 아래 legacyRedirects 는 Search Console/애널리틱스에서 수집한 "실제 옛 URL"로 채운다.
//    추측으로 넣으면 잘못된 301이 캐시되므로, 확인된 경로만 추가할 것.
const legacyRedirects = [
  // 커뮤니티는 제거됨 → 홈으로. (기존 server-component redirect를 영구 301로 승격)
  { source: '/community', destination: '/', permanent: true },
  { source: '/community/:path*', destination: '/', permanent: true },
  // 예시(수집 후 활성화):
  // { source: '/faq', destination: '/help', permanent: true },
  // { source: '/notice/:slug*', destination: '/', permanent: true },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  poweredByHeader: false,
  outputFileTracingRoot: webRoot,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
