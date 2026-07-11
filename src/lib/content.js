import { supabase } from './supabase';

// DB row -> 앱이 기존에 쓰던 article shape으로 매핑
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    situations: row.situations || [],
    regions: row.regions || [],
    summary: row.summary || '',
    url: row.url,
    date: row.date,
  };
}

// 어드민에서 발행(published=true)한 글만 최신순으로 가져옴.
// Supabase가 설정 안 됐거나(로컬 개발 초기) 네트워크 오류면 null을 반환 — 호출 측에서 캐시/시드로 폴백.
export async function fetchArticles() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });
  if (error) {
    console.warn('fetchArticles failed:', error.message);
    return null;
  }
  return data.map(mapRow);
}
