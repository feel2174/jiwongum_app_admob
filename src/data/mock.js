// 목(mock) 데이터. 나중에 이 모듈만 실제 API 응답으로 교체하면 됩니다.
// 응답 형태는 개발 기획서의 API 계약(GET /api/subsidies/:id)과 동일합니다.

function iso(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export const CATEGORIES = ['전체', '주거', '청년', '취업', '창업', '문화'];

export const SUBSIDIES = [
  {
    id: 's1',
    title: '청년월세 특별지원',
    categories: ['주거', '청년'],
    target: '만 19~34세 · 무주택 청년',
    amount: '월 20만원 × 최대 12개월',
    region: '전국',
    applyEnd: iso(12),
    source: '국토교통부',
    sourceUrl: 'https://www.gov.kr',
    sections: [
      { h: '신청 방법', body: '복지로 온라인 또는 주소지 주민센터 방문 신청.' },
      { h: '구비 서류', body: '임대차계약서, 소득·재산 증빙서류.' },
    ],
  },
  {
    id: 's2',
    title: '국민취업지원제도 2유형',
    categories: ['취업'],
    target: '15~69세 구직자',
    amount: '구직촉진수당 + 취업지원 서비스',
    region: '전국',
    applyEnd: null,
    source: '고용노동부',
    sourceUrl: 'https://www.work24.go.kr',
    sections: [
      { h: '신청 방법', body: '고용24 온라인 신청 후 취업활동계획 수립.' },
      { h: '구비 서류', body: '신분증, 소득 신고 자료.' },
    ],
  },
  {
    id: 's3',
    title: '소상공인 정책자금 융자',
    categories: ['창업'],
    target: '업력 요건 충족 소상공인',
    amount: '최대 7,000만원 저리 융자',
    region: '전국',
    applyEnd: iso(30),
    source: '중소벤처기업부',
    sourceUrl: 'https://www.sbiz.or.kr',
    sections: [
      { h: '신청 방법', body: '소상공인시장진흥공단 누리집 신청 후 상담.' },
      { h: '구비 서류', body: '사업자등록증, 매출 증빙.' },
    ],
  },
  {
    id: 's4',
    title: '청년 예비창업 지원금',
    categories: ['창업', '청년'],
    target: '예비·초기 청년 창업자',
    amount: '사업화 자금 최대 1억원',
    region: '서울',
    applyEnd: iso(5),
    source: '서울시',
    sourceUrl: 'https://www.seoul.go.kr',
    sections: [
      { h: '신청 방법', body: '서울창업허브 공고 접수처 온라인 신청.' },
      { h: '구비 서류', body: '사업계획서, 창업 관련 증빙.' },
    ],
  },
  {
    id: 's5',
    title: '신혼부부 전세대출 이자지원',
    categories: ['주거'],
    target: '혼인 7년 이내 신혼부부',
    amount: '대출이자 최대 연 2% 지원',
    region: '전국',
    applyEnd: iso(9),
    source: '국토교통부',
    sourceUrl: 'https://www.gov.kr',
    sections: [
      { h: '신청 방법', body: '기금e든든 온라인 신청 또는 수탁은행 방문.' },
      { h: '구비 서류', body: '혼인관계증명서, 전세계약서.' },
    ],
  },
  {
    id: 's6',
    title: '통합문화이용권(문화누리카드)',
    categories: ['문화'],
    target: '기초생활수급자 · 차상위계층',
    amount: '연 13만원 문화·여행·체육',
    region: '전국',
    applyEnd: iso(143),
    source: '문화체육관광부',
    sourceUrl: 'https://www.mnuri.kr',
    sections: [
      { h: '신청 방법', body: '문화누리 누리집 또는 주민센터에서 발급.' },
      { h: '구비 서류', body: '신분증.' },
    ],
  },
];

// 속보/정책 뉴스: 제목 + 출처 + 링크아웃만. (전문 재게시 금지)
export const NEWS = [
  { id: 'n1', tag: '속보', title: '2026년 청년 주거지원 예산 30% 확대 편성', source: '연합뉴스', time: '12분 전', url: 'https://www.yna.co.kr' },
  { id: 'n2', tag: '정책', title: '소상공인 정책자금 대출 금리 0.5%p 인하', source: '뉴스1', time: '1시간 전', url: 'https://www.news1.kr' },
  { id: 'n3', tag: '속보', title: '국민취업지원제도 신청 소득요건 완화 시행', source: '머니투데이', time: '3시간 전', url: 'https://www.mt.co.kr' },
];

export function ddayOf(endDate) {
  if (!endDate) return { label: '상시', soft: true, days: Infinity };
  const end = new Date(endDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.ceil((end - now) / 86400000);
  if (days < 0) return { label: '마감', soft: true, days };
  return { label: 'D-' + days, soft: days > 30, days };
}

export function findSubsidy(id) {
  return SUBSIDIES.find((s) => s.id === id);
}

export function findNews(id) {
  return NEWS.find((n) => n.id === id);
}
