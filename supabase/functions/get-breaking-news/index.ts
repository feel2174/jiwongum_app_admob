// Supabase Edge Function: 네이버 뉴스 검색 API 프록시 — 홈 화면 "속보" 섹션용.
// Client Secret이 서버에만 있어야 해서 앱이 직접 네이버 API를 호출하지 않고 이 함수를 거친다.
// 인증 불필요(공개 프록시) — 배포 시 --no-verify-jwt 사용.
//
// 배포: supabase functions deploy get-breaking-news --no-verify-jwt
// 시크릿: supabase secrets set NAVER_CLIENT_ID=... NAVER_CLIENT_SECRET=...

const NAVER_URL = 'https://openapi.naver.com/v1/search/news.json';
const DEFAULT_QUERY = '정부 지원금 정책';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function stripTags(s: string) {
  return (s || '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
}

function sourceOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || DEFAULT_QUERY;
    const display = url.searchParams.get('display') || '5';

    const naverRes = await fetch(
      `${NAVER_URL}?query=${encodeURIComponent(query)}&display=${display}&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': Deno.env.get('NAVER_CLIENT_ID')!,
          'X-Naver-Client-Secret': Deno.env.get('NAVER_CLIENT_SECRET')!,
        },
      },
    );
    if (!naverRes.ok) throw new Error(`네이버 API 응답 오류: ${naverRes.status}`);
    const json = await naverRes.json();

    const items = (json.items || []).map((it: any, i: number) => ({
      id: 'news-' + i,
      tag: '속보',
      title: stripTags(it.title),
      url: it.originallink || it.link,
      source: sourceOf(it.originallink || it.link),
    }));

    return new Response(JSON.stringify({ items }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
