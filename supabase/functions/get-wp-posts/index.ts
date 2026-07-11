// Supabase Edge Function: 워드프레스(zucca100.com) 최신 글을 서버사이드에서 가져와
// 이미 articles 테이블에 들어간 글(wp_post_id)은 제외하고 반환.
// 브라우저(admin 페이지)에서 WP REST API를 직접 호출하면 CORS가 막힐 수 있어 이 함수를 경유한다.
//
// 배포: supabase functions deploy get-wp-posts
// 호출: 로그인한 관리자 세션의 access token을 Authorization 헤더로 전달해야 함(기본 JWT 검증 사용).

import { createClient } from 'jsr:@supabase/supabase-js@2';

const WP_BASE = 'https://zucca100.com/wp-json/wp/v2/posts';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function stripHtml(html: string) {
  return (html || '').replace(/<[^>]*>/g, '').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const url = new URL(req.url);
    const perPage = url.searchParams.get('per_page') || '20';

    const wpRes = await fetch(`${WP_BASE}?per_page=${perPage}&_embed`);
    if (!wpRes.ok) {
      throw new Error(`WordPress API 응답 오류: ${wpRes.status}`);
    }
    const wpPosts = await wpRes.json();

    const wpIds = wpPosts.map((p: any) => p.id);
    const { data: existing, error } = await supabase
      .from('articles')
      .select('wp_post_id')
      .in('wp_post_id', wpIds);
    if (error) throw error;

    const importedIds = new Set((existing || []).map((r: any) => r.wp_post_id));

    const posts = wpPosts
      .filter((p: any) => !importedIds.has(p.id))
      .map((p: any) => ({
        wp_post_id: p.id,
        title: stripHtml(p.title?.rendered),
        summary: stripHtml(p.excerpt?.rendered).slice(0, 200),
        url: p.link,
        date: (p.date || '').slice(0, 10),
      }));

    return new Response(JSON.stringify({ posts }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
