// 보조금24(gov24, odcloud) 서버 전용 클라이언트.
// 이 파일은 서버(라우트 핸들러/서버 컴포넌트)에서만 import 한다. GOV_API_KEY는 절대 클라이언트로 나가면 안 됨.
//
// gov24 serviceList는 서버측 키워드 필터를 지원하지 않으므로(cond → 400),
// 전체 목록(약 11,000건)을 페이지 단위로 받아 필요한 필드만 추린 인덱스를 만들고,
// 키워드 검색은 이 인덱스에서 처리한다.
// - HTTP fetch 레벨 캐시(next.revalidate)로 페이지 응답을 재사용(각 페이지 <2MB).
// - 모듈 메모로 추린 인덱스를 웜 인스턴스 내에서 재사용(전체 인덱스는 2MB를 넘어 unstable_cache 부적합).

const BASE = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
const PER_PAGE = 1000;
const REVALIDATE_SECONDS = 21600; // 6시간
const MEMO_TTL_MS = REVALIDATE_SECONDS * 1000;

// 카드 표시용: 원문을 구두점/불릿(○ ● ▷ ※ ||) 기준으로 줄을 나눠 읽기 좋게 재정렬.
// 공공데이터 원문은 "○ 항목1 ○ 항목2" 처럼 붙어 있어 그대로 뿌리면 정렬이 무너진다.
function toBullets(text, { maxLines = 6, maxLen = 140 } = {}) {
  if (!text) return [];
  let t = String(text).replace(/\r/g, '\n');
  t = t.replace(/\s*\|\|\s*/g, '\n'); // || → 줄바꿈
  t = t.replace(/\s*[○●◦▷▶■□▪※]\s*/g, '\n'); // 불릿/기호 → 줄바꿈 (·는 '결정·고시' 등 단어 내 구분자라 제외)
  return t
    .split(/\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, maxLines)
    .map((s) => (s.length > maxLen ? `${s.slice(0, maxLen)}…` : s));
}

// 단문(신청처 기관명 등): 한 줄로 정리 + 길이 제한.
function cleanText(s, max = 80) {
  const t = (s || '').replace(/\s*\|\|\s*/g, ', ').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

// "교육부/02-6222-6060||0079에듀콜/1544-0079-5-1" 처럼 섞인 문자열에서 첫 전화번호만 추출.
function firstPhone(s) {
  if (!s) return '';
  const m = String(s).match(/\d(?:[\d-]{5,}\d)/); // 02-6222-6060, 1544-0079 등
  return m ? m[0] : '';
}

// gov24 원본 한글 필드명 → 앱 내부 키. 상세 4항목(대상/금액/신청방법/신청처)은 줄 배열로.
function trim(row) {
  return {
    id: row['서비스ID'] || '',
    name: row['서비스명'] || '',
    summary: row['서비스목적요약'] || '',
    org: row['소관기관명'] || '',
    orgType: row['소관기관유형'] || '',
    field: row['서비스분야'] || '',
    deadline: row['신청기한'] || '',
    url: row['상세조회URL'] || '',
    // 4항목 요약 카드 (구두점 기준 재정렬된 줄 배열)
    target: toBullets(row['지원대상'] || row['선정기준']), // 대상
    amount: toBullets(row['지원내용'] || row['지원유형']), // 금액
    method: toBullets(row['신청방법'], { maxLines: 5, maxLen: 60 }), // 신청방법
    receiver: cleanText(row['접수기관'], 60), // 신청처(기관)
    phone: firstPhone(row['전화문의']), // 신청처(전화)
    views: Number(row['조회수']) || 0,
  };
}

async function fetchPage(page) {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(PER_PAGE),
    serviceKey: process.env.GOV_API_KEY || '',
  });
  const res = await fetch(`${BASE}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS, tags: ['gov24'] },
  });
  if (!res.ok) throw new Error(`gov24 page ${page} HTTP ${res.status}`);
  return res.json();
}

let memo = { at: 0, data: null };

// 전체 인덱스를 반환. 실패하면 예외를 던지지 않고 빈 배열 대신 마지막 성공분(있으면)을 반환.
export async function getServiceIndex() {
  const now = Date.now();
  if (memo.data && now - memo.at < MEMO_TTL_MS) return memo.data;

  if (!process.env.GOV_API_KEY) {
    // 키가 없으면 검색 불가 — 빈 인덱스. 상위(라우트)에서 폴백 처리.
    return memo.data || [];
  }

  try {
    const first = await fetchPage(1);
    const total = first.totalCount || (first.data ? first.data.length : 0);
    const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

    const rows = [...(first.data || [])];
    for (let p = 2; p <= pageCount; p += 1) {
      const next = await fetchPage(p); // eslint-disable-line no-await-in-loop
      if (next.data) rows.push(...next.data);
    }

    const index = rows.map(trim).filter((r) => r.id && r.name);
    memo = { at: now, data: index };
    return index;
  } catch (err) {
    console.error('gov24 index build failed:', err.message);
    return memo.data || []; // 갱신 실패 시 이전 성공분 유지
  }
}

const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '');

// 실제 공공데이터는 같은 개념도 "지원금"/"보조금"/"지원비"로 제각각 쓴다.
// 사용자가 어느 쪽으로 검색해도 같은 결과가 나오도록 동의어 그룹을 두고,
// 쿼리에 포함된 동의어를 다른 동의어로도 바꿔치기한 변형들을 함께 검색한다.
const SYNONYM_GROUPS = [
  ['지원금', '보조금', '지원비'],
];

function expandQueryVariants(q) {
  const variants = new Set([q]);
  for (const group of SYNONYM_GROUPS) {
    const hit = group.find((term) => q.includes(term));
    if (!hit) continue;
    for (const alt of group) {
      if (alt === hit) continue;
      variants.add(q.split(hit).join(alt));
    }
  }
  return [...variants];
}

// 지역 토큰이 소관기관명에 포함되는지(지자체 서비스 매칭용). '전국'/중앙행정기관은 항상 포함.
function matchesRegion(item, region) {
  if (!region || region === '전국') return true;
  if (item.orgType && item.orgType.includes('중앙')) return true; // 중앙행정기관은 전국 대상
  const token = region.replace(/(특별시|광역시|특별자치시|특별자치도|도)$/u, '');
  return item.org.includes(region) || (token && item.org.includes(token));
}

// 키워드 검색. name/summary 부분일치. region이 있으면 지역 필터를 추가 적용.
export async function searchServices(query, { region = '', limit = 40 } = {}) {
  const q = norm(query);
  if (!q) return [];
  const variants = expandQueryVariants(q);

  const index = await getServiceIndex();
  const scored = [];

  for (const item of index) {
    if (!matchesRegion(item, region)) continue;
    const name = norm(item.name);
    const summary = norm(item.summary);

    // 정확 일치 > 시작 일치 > 이름 포함 > 요약 포함. (조회수는 동점 tiebreaker)
    // 동의어 변형 중 가장 점수가 높은 매칭을 채택한다. 요약에만 걸리면 점수는 0이어도 매칭으로 친다.
    let matched = false;
    let score = 0;
    for (const v of variants) {
      const inName = name.includes(v);
      const inSummary = summary.includes(v);
      if (!inName && !inSummary) continue;
      matched = true;
      let vScore = 0;
      if (name === v) vScore += 5;
      else if (name.startsWith(v)) vScore += 3;
      if (inName) vScore += 2;
      if (vScore > score) score = vScore;
    }
    if (!matched) continue;
    scored.push({ item, score });
  }

  scored.sort((a, b) => (b.score - a.score) || (b.item.views - a.item.views));
  return scored.slice(0, limit).map((s) => s.item);
}

// 시니어 대상 인기 지원금(검색 0건/폴백용). 큐레이션 키워드별 대표 1건.
// 대표 선정: 서비스명에 키워드 포함 → 중앙행정기관 우선 → 조회수 높은 순.
const POPULAR_KEYWORDS = ['기초연금', '노인일자리', '틀니', '에너지', '장기요양'];

export async function getPopularServices(limit = 5) {
  const index = await getServiceIndex();
  const picks = [];
  const usedIds = new Set();

  for (const kw of POPULAR_KEYWORDS) {
    const q = norm(kw);
    const candidates = index
      .filter((it) => norm(it.name).includes(q) && !usedIds.has(it.id))
      .sort((a, b) => {
        const ac = a.orgType.includes('중앙') ? 1 : 0;
        const bc = b.orgType.includes('중앙') ? 1 : 0;
        if (ac !== bc) return bc - ac;
        return b.views - a.views;
      });
    if (candidates[0]) {
      picks.push(candidates[0]);
      usedIds.add(candidates[0].id);
    }
    if (picks.length >= limit) break;
  }

  // 큐레이션으로 부족하면 조회수 상위로 채움
  if (picks.length < limit) {
    for (const it of [...index].sort((a, b) => b.views - a.views)) {
      if (usedIds.has(it.id)) continue;
      picks.push(it);
      usedIds.add(it.id);
      if (picks.length >= limit) break;
    }
  }

  return picks.slice(0, limit);
}
