// 규칙 기반 추천/매칭 (ML 불필요). 상황 태그 겹침으로 개인화.
import { ARTICLES } from '../data/mock';

const byDateDesc = (a, b) => b.date.localeCompare(a.date);

export function overlap(article, situations) {
  if (!situations || situations.length === 0) return 0;
  return article.situations.filter((s) => situations.includes(s)).length;
}

// 홈: 내 상황과 겹치는 글 (겹침 수 → 최신순)
export function personalized(situations) {
  return ARTICLES.map((a) => ({ a, s: overlap(a, situations) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || byDateDesc(x.a, y.a))
    .map((x) => x.a);
}

// 매칭된 첫 상황 라벨 (카드 배지용)
export function matchLabel(article, situations) {
  if (!situations) return null;
  return article.situations.find((s) => situations.includes(s)) || null;
}

export function latest(excludeIds = []) {
  return ARTICLES.filter((a) => !excludeIds.includes(a.id)).slice().sort(byDateDesc);
}

export function bySituation(sit) {
  return ARTICLES.filter((a) => a.situations.includes(sit)).sort(byDateDesc);
}

export function byCategory(cat) {
  return cat === '전체' ? ARTICLES.slice().sort(byDateDesc) : ARTICLES.filter((a) => a.category === cat).sort(byDateDesc);
}

export function countBySituation(sit) {
  return ARTICLES.filter((a) => a.situations.includes(sit)).length;
}

// 상세: 이런 지원금도 (상황 공유 2점 + 같은 카테고리 1점)
export function related(article, n = 3) {
  return ARTICLES.filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      s: a.situations.filter((x) => article.situations.includes(x)).length * 2 + (a.category === article.category ? 1 : 0),
    }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s || byDateDesc(x.a, y.a))
    .slice(0, n)
    .map((x) => x.a);
}
