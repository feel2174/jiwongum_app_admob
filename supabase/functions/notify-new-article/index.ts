// Supabase Edge Function: 어드민이 글을 발행할 때 호출 — push_tokens 전체에 Expo 푸시 발송.
// 전체 브로드캐스트 (상황별 타겟팅 없음). 기본 JWT 검증 사용 — 관리자 세션 토큰으로만 호출 가능.
//
// 배포: supabase functions deploy notify-new-article
// 호출: admin/index.html에서 발행 성공 직후 { id, title, url }을 POST

import { createClient } from 'jsr:@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const CHUNK_SIZE = 100;
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function chunk(arr: any[], size: number) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { id, title, url } = await req.json();
    if (!title || !url) throw new Error('title, url이 필요합니다.');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: tokens, error } = await supabase.from('push_tokens').select('token');
    if (error) throw error;

    const messages = (tokens || []).map((t: any) => ({
      to: t.token,
      title: '[새 글] 지원금·정책',
      body: title,
      data: { articleId: id, url },
    }));

    let sent = 0;
    for (const batch of chunk(messages, CHUNK_SIZE)) {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Accept-encoding': 'gzip, deflate' },
        body: JSON.stringify(batch),
      });
      if (res.ok) sent += batch.length;
    }

    return new Response(JSON.stringify({ sent, total: messages.length }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
