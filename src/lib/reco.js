// 규칙 기반 추천/매칭 (ML 불필요). 상황 태그 겹침으로 개인화.
// articles는 항상 호출하는 쪽(화면)에서 useStore().articles로 받아 첫 인자로 넘긴다.

const byDateDesc = (a, b) => b.date.localeCompare(a.date);

export function overlap(article, situations) {
  if (!situations || situations.length === 0) return 0;
  return article.situations.filter((s) => situations.includes(s)).length;
}

// 홈: 내 상황과 겹치는 글 (겹침 수 → 최신순)
export function personalized(articles, situations) {
  return articles.map((a) => ({ a, s: overlap(a, situations) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || byDateDesc(x.a, y.a))
    .map((x) => x.a);
}

// 매칭된 첫 상황 라벨 (카드 배지용)
export function matchLabel(article, situations) {
  if (!situations) return null;
  return article.situations.find((s) => situations.includes(s)) || null;
}

export function latest(articles, excludeIds = []) {
  return articles.filter((a) => !excludeIds.includes(a.id)).slice().sort(byDateDesc);
}

export function bySituation(articles, sit) {
  return articles.filter((a) => a.situations.includes(sit)).sort(byDateDesc);
}

export function byCategory(articles, cat) {
  return cat === '전체' ? articles.slice().sort(byDateDesc) : articles.filter((a) => a.category === cat).sort(byDateDesc);
}

export function countBySituation(articles, sit) {
  return articles.filter((a) => a.situations.includes(sit)).length;
}

// 상세: 이런 지원금도 (상황 공유 2점 + 같은 카테고리 1점)
export function related(articles, article, n = 3) {
  return articles.filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      s: a.situations.filter((x) => article.situations.includes(x)).length * 2 + (a.category === article.category ? 1 : 0),
    }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || byDateDesc(x.a, y.a))
    .slice(0, n)
    .map((x) => x.a);
}

export function findArticle(articles, id) {
  return articles.find((a) => a.id === id);
}

// ── 속보 영역 (건드리지 말 것) ─────────────────────────────
// 향후 뉴스 API로 대체할 전용 슬롯. 지금은 최신 글 상위 3개로 임시 대체.
// 지원금 목록(전체 최신 등)과 섞이지 않도록 화면에서 이 결과를 별도 슬롯으로만 사용할 것.
export function news(articles) {
  // 네이버 API 실패 시 폴백. 핫딜(할인·구독)은 속보로 부적절하니 제외하고 지원금·정책 글만.
  const pool = articles.filter((a) => a.category !== '핫딜');
  const base = pool.length > 0 ? pool : articles;
  return base.slice().sort(byDateDesc).slice(0, 3).map((a) => ({
    id: 'nb-' + a.id,
    tag: '속보',
    title: a.title,
    url: a.url,
  }));
}
// ───────────────────────────────────────────────────────
