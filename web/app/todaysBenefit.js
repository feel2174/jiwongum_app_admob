// 오늘의 혜택(재방문 기능 ①). 날짜 기준으로 결정적으로 1건을 고른다.
// 외부 API 의존 없이 큐레이션된 정적 글(seniorArticles)에서 선택 → 홈이 항상 빠르고 안정적,
// 매일 바뀌어 재방문 이유가 된다.

function dateSeed(date = new Date()) {
  // 로컬 날짜(YYYYMMDD) 기반 정수 시드
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function pickTodaysBenefit(articles, date = new Date()) {
  const pool = articles.filter((a) => a.url && !a.comingSoon);
  const source = pool.length > 0 ? pool : articles;
  if (source.length === 0) return null;
  return source[dateSeed(date) % source.length];
}
