// 홈 화면 "속보" 섹션 — 네이버 뉴스 검색 API를 get-breaking-news Edge Function으로 프록시해서 받아옴.
// Supabase 미설정/네트워크 실패 시 null 반환 — 호출 측(store.js)이 reco.js의 news(articles) placeholder로 폴백.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function fetchBreakingNews() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/get-breaking-news`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.error || !Array.isArray(json.items)) return null;
    return json.items;
  } catch (e) {
    console.warn('fetchBreakingNews failed:', e.message);
    return null;
  }
}
