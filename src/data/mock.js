// 실제 글 목록은 어드민 도구(admin/)에서 Supabase articles 테이블로 관리됨.
// SEED_ARTICLES는 최초 실행/오프라인/Supabase 미설정 시에만 쓰이는 폴백.

export const CATEGORIES = ['전체', '지원금·수당', '청년', '취업·일자리', '주거·세금', '핫딜'];

// 상황(대상) 태그 — 개인화의 뼈대
export const SITUATIONS = [
  { key: '청년', emoji: '🎓' },
  { key: '신혼·육아', emoji: '👶' },
  { key: '구직·취업', emoji: '💼' },
  { key: '주거', emoji: '🏠' },
  { key: '시니어', emoji: '👵' },
  { key: '소상공인', emoji: '🏪' },
  { key: '저소득·복지', emoji: '🤝' },
];

export const REGIONS = ['전국', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

// 최초 실행 시 네트워크 없이도 뭔가 보이도록 하는 오프라인 폴백 시드.
// 실제 콘텐츠는 어드민 도구 → Supabase articles 테이블에서 관리됨 (src/lib/content.js 참고).
export const SEED_ARTICLES = [
  {
    "id": "a1",
    "title": "문화누리카드 발급·잔액조회",
    "category": "지원금·수당",
    "situations": [
      "저소득·복지"
    ],
    "regions": [
      "전국"
    ],
    "summary": "2026년 문화누리카드 신청, 잔액조회, 사용처를 팩트 기반으로 정리했습니다.",
    "url": "https://zucca100.com/%eb%ac%b8%ed%99%94%eb%88%84%eb%a6%ac%ec%b9%b4%eb%93%9c-%eb%b0%9c%ea%b8%89-%eb%b0%a9%eb%b2%95-%ec%9e%94%ec%95%a1%ec%a1%b0%ed%9a%8c-%ec%82%ac%ec%9a%a9%ec%b2%98-%eb%b3%b4%ea%b8%b0/",
    "date": "2026-07-08"
  },
  {
    "id": "a2",
    "title": "기초연금 모의계산·신청 방법",
    "category": "지원금·수당",
    "situations": [
      "시니어",
      "저소득·복지"
    ],
    "regions": [
      "전국"
    ],
    "summary": "내 기초연금 수급액을 모의계산하고 신청하는 방법.",
    "url": "https://zucca100.com/%ea%b8%b0%ec%b4%88%ec%97%b0%ea%b8%88-%eb%aa%a8%ec%9d%98%ea%b3%84%ec%82%b0-%eb%b0%8f-%ec%8b%a0%ec%b2%ad-%eb%b0%a9%eb%b2%95/",
    "date": "2026-07-08"
  },
  {
    "id": "a3",
    "title": "돌봄수당 신청 방법·지급금액",
    "category": "지원금·수당",
    "situations": [
      "신혼·육아"
    ],
    "regions": [
      "전국"
    ],
    "summary": "돌봄수당 대상, 지급금액, 신청 절차를 정리했습니다.",
    "url": "https://zucca100.com/%eb%8f%8c%eb%b4%84%ec%88%98%eb%8b%b9-%ec%8b%a0%ec%b2%ad%eb%b0%a9%eb%b2%95-%eb%b0%8f-%ec%a7%80%ea%b8%89%ea%b8%88%ec%95%a1-%ec%8b%a0%ec%b2%ad%ed%95%98%ea%b8%b0/",
    "date": "2026-07-08"
  },
  {
    "id": "a4",
    "title": "장애인연금 신청 방법·대상",
    "category": "지원금·수당",
    "situations": [
      "저소득·복지"
    ],
    "regions": [
      "전국"
    ],
    "summary": "장애인연금 지급 대상과 필요서류, 신청 방법.",
    "url": "https://zucca100.com/%ec%9e%a5%ec%95%a0%ec%9d%b8%ec%97%b0%ea%b8%88-%ec%8b%a0%ec%b2%ad-%eb%b0%a9%eb%b2%95-%eb%8c%80%ec%83%81-%ed%95%84%ec%9a%94%ec%84%9c%eb%a5%98/",
    "date": "2026-07-08"
  },
  {
    "id": "a5",
    "title": "에너지바우처 신청·잔액조회",
    "category": "지원금·수당",
    "situations": [
      "저소득·복지"
    ],
    "regions": [
      "전국"
    ],
    "summary": "에너지바우처 신청 대상, 잔액조회, 사용기간·사용처 안내.",
    "url": "https://zucca100.com/energy-voucher/",
    "date": "2026-06-17"
  },
  {
    "id": "a6",
    "title": "육아휴직급여 신청·지급액",
    "category": "지원금·수당",
    "situations": [
      "신혼·육아"
    ],
    "regions": [
      "전국"
    ],
    "summary": "육아휴직급여 금액, 신청 방법, 지급일 계산까지.",
    "url": "https://zucca100.com/parental-leave-benefits/",
    "date": "2026-07-06"
  },
  {
    "id": "a7",
    "title": "기초생활수급자 지원금 조건·혜택",
    "category": "지원금·수당",
    "situations": [
      "저소득·복지"
    ],
    "regions": [
      "전국"
    ],
    "summary": "기초생활수급자 선정 조건과 받을 수 있는 지원 혜택.",
    "url": "https://zucca100.com/%ea%b8%b0%ec%b4%88%ec%83%9d%ed%99%9c%ec%88%98%ea%b8%89%ec%9e%90-%ec%a7%80%ec%9b%90%ea%b8%88-%ec%a1%b0%ea%b1%b4-%ed%98%9c%ed%83%9d-%ec%8b%a0%ec%b2%ad%eb%b0%a9%eb%b2%95/",
    "date": "2026-07-07"
  },
  {
    "id": "a8",
    "title": "생리대 바우처 신청·잔액조회",
    "category": "지원금·수당",
    "situations": [
      "저소득·복지",
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "여성청소년 생리대 바우처 온라인몰 잔액조회와 신청 방법.",
    "url": "https://zucca100.com/%ec%83%9d%eb%a6%ac%eb%8c%80%eb%b0%94%ec%9a%b0%ec%b2%98-%ec%98%a8%eb%9d%bc%ec%9d%b8%eb%aa%b0-%ec%9e%94%ec%95%a1%ec%a1%b0%ed%9a%8c-%ec%82%ac%ec%9a%a9%eb%b0%a9%eb%b2%95-%ec%8b%a0%ec%b2%ad%ed%95%98/",
    "date": "2026-07-07"
  },
  {
    "id": "a9",
    "title": "청년미래적금 신청·조건·금리",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "청년미래적금 신청기간, 가입 조건, 금리를 정리했습니다.",
    "url": "https://zucca100.com/%ec%b2%ad%eb%85%84%eb%af%b8%eb%9e%98%ec%a0%81%ea%b8%88-%ec%8b%a0%ec%b2%ad%ea%b8%b0%ea%b0%84-%ec%8b%a0%ec%b2%ad-%ec%a1%b0%ea%b1%b4-%ea%b8%88%eb%a6%ac-%ec%a0%95%eb%a6%ac/",
    "date": "2026-06-05"
  },
  {
    "id": "a10",
    "title": "희망두배 청년통장 신청·조건",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "희망두배 청년통장 가입 조건과 필요서류, 신청 방법.",
    "url": "https://zucca100.com/%ed%9d%ac%eb%a7%9d%eb%91%90%eb%b0%b0%ec%b2%ad%eb%85%84%ed%86%b5%ec%9e%a5-%ec%8b%a0%ec%b2%ad-%ec%a1%b0%ea%b1%b4-%ec%84%9c%eb%a5%98-%ed%9b%84%ea%b8%b0/",
    "date": "2026-06-09"
  },
  {
    "id": "a11",
    "title": "경기도 청년복지포인트 신청",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "경기"
    ],
    "summary": "경기도 청년복지포인트 신청 대상, 서류, 신청기간 안내.",
    "url": "https://zucca100.com/youth-welfare-point/",
    "date": "2026-07-02"
  },
  {
    "id": "a12",
    "title": "국가장학금 신청 대상·방법",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "국가장학금 신청 대상과 신청 방법을 정리했습니다.",
    "url": "https://zucca100.com/%ea%b5%ad%ea%b0%80%ec%9e%a5%ed%95%99%ea%b8%88-%ec%8b%a0%ec%b2%ad-%eb%8c%80%ec%83%81-%ec%8b%a0%ec%b2%ad%eb%b0%a9%eb%b2%95-%eb%b0%94%eb%a1%9c%ea%b0%80%ea%b8%b0/",
    "date": "2026-05-19"
  },
  {
    "id": "a13",
    "title": "K패스 발급·교통비 환급",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "K패스 등록·발급 방법과 대중교통비 환급 기준·조건.",
    "url": "https://zucca100.com/k-pass-2/",
    "date": "2026-06-17"
  },
  {
    "id": "a14",
    "title": "노인일자리 신청 방법·서류",
    "category": "취업·일자리",
    "situations": [
      "시니어",
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "2026년 정부 지원 노인일자리 신청 방법과 필수 서류 기준.",
    "url": "https://zucca100.com/%eb%85%b8%ec%9d%b8%ec%9d%bc%ec%9e%90%eb%a6%ac-%ec%8b%a0%ec%b2%ad-%eb%b0%a9%eb%b2%95-%ea%b8%b0%ec%a4%80-%ec%84%9c%eb%a5%98/",
    "date": "2026-07-08"
  },
  {
    "id": "a15",
    "title": "구직급여(실업급여) 신청·조건",
    "category": "취업·일자리",
    "situations": [
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "구직급여 신청 방법, 수급 조건, 지급 금액 정리.",
    "url": "https://zucca100.com/%ea%b5%ac%ec%a7%81%ea%b8%89%ec%97%ac-%ec%8b%a0%ec%b2%ad%eb%b0%a9%eb%b2%95-%eb%b0%8f-%ec%a1%b0%ea%b1%b4-%ea%b8%88%ec%95%a1/",
    "date": "2026-07-08"
  },
  {
    "id": "a16",
    "title": "워크넷 구인구직 이용법",
    "category": "취업·일자리",
    "situations": [
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "고용노동부 워크넷 구인구직 사이트 이용 방법 안내.",
    "url": "https://zucca100.com/work-net/",
    "date": "2026-07-07"
  },
  {
    "id": "a17",
    "title": "폐업지원금 신청(소상공인)",
    "category": "취업·일자리",
    "situations": [
      "소상공인"
    ],
    "regions": [
      "전국"
    ],
    "summary": "소상공인·자영업자 폐업지원금 신청 조건과 방법.",
    "url": "https://zucca100.com/closed-down/",
    "date": "2026-07-07"
  },
  {
    "id": "a18",
    "title": "요양보호사 자격증 국비지원",
    "category": "취업·일자리",
    "situations": [
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "요양보호사 자격증을 국비지원으로 취득하는 방법.",
    "url": "https://zucca100.com/%ec%9a%94%ec%96%91%eb%b3%b4%ed%98%b8%ec%82%ac-%ec%9e%90%ea%b2%a9%ec%a6%9d-%eb%94%b0%eb%8a%94%eb%b2%95-%ea%b5%ad%eb%b9%84%ec%a7%80%ec%9b%90-%ec%9e%ac%eb%b0%9c%ea%b8%89/",
    "date": "2026-06-10"
  },
  {
    "id": "a19",
    "title": "행복주택 신청·입주자격",
    "category": "주거·세금",
    "situations": [
      "주거"
    ],
    "regions": [
      "전국"
    ],
    "summary": "행복주택 입주자격, 공고 확인, LH·SH 신청 방법.",
    "url": "https://zucca100.com/myhome-portal/",
    "date": "2026-07-06"
  },
  {
    "id": "a20",
    "title": "온비드 공매 입찰 방법",
    "category": "주거·세금",
    "situations": [
      "주거"
    ],
    "regions": [
      "전국"
    ],
    "summary": "집에서 부동산·물건을 찾는 온비드 공매 입찰·명도 방법.",
    "url": "https://zucca100.com/%ec%98%a8%eb%b9%84%eb%93%9c-%ea%b3%b5%eb%a7%a4-%ec%82%ac%ec%9d%b4%ed%8a%b8-%eb%b0%a9%eb%b2%95-%ec%9e%85%ec%b0%b0-%eb%aa%85%eb%8f%84-%ec%95%84%ed%8c%8c%ed%8a%b8-%eb%ac%bc%ea%b1%b4-%ec%a1%b0%ed%9a%8c/",
    "date": "2026-07-08"
  },
  {
    "id": "a21",
    "title": "숨은 환급금 조회(홈택스)",
    "category": "주거·세금",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "국세·지방세·통신비 등 숨은 환급금을 한 번에 조회하는 법.",
    "url": "https://zucca100.com/not-return-tax/",
    "date": "2026-07-06"
  },
  {
    "id": "a22",
    "title": "자동차세 환급 신청 방법",
    "category": "주거·세금",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "중고차 판매·폐차 시 자동차세 환급 신청 방법.",
    "url": "https://zucca100.com/car-tax-return/",
    "date": "2026-07-06"
  },
  {
    "id": "a23",
    "title": "건강보험 피부양자 등록",
    "category": "주거·세금",
    "situations": [
      "시니어"
    ],
    "regions": [
      "전국"
    ],
    "summary": "부모님 건강보험 피부양자 등록 방법과 조건·서류.",
    "url": "https://zucca100.com/%eb%b6%80%eb%aa%a8%eb%8b%98-%ea%b1%b4%ea%b0%95%eb%b3%b4%ed%97%98-%ed%94%bc%eb%b6%80%ec%96%91%ec%9e%90-%eb%93%b1%eb%a1%9d-%eb%b0%a9%eb%b2%95-%ec%84%9c%eb%a5%98-%ec%a1%b0%ed%9a%8c-%ec%a1%b0%ea%b1%b4/",
    "date": "2026-05-21"
  },
  {
    "id": "a24",
    "title": "클로드(Claude) 요금제 할인받는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "클로드 구독료를 2026년 최저가로 세팅하는 방법.",
    "url": "https://zucca100.com/%ed%81%b4%eb%a1%9c%eb%93%9c-%ed%81%b4%eb%a1%9c%eb%93%9c%ec%bd%94%eb%93%9c-%ed%81%b4%eb%a1%9c%eb%93%9c-%eb%a7%a5%ec%8a%a4-cluade-max-%ea%b0%80%ea%b2%a9-%ed%95%a0%ec%9d%b8-%ec%9d%b8%ed%95%98-%eb%ac%b4/",
    "date": "2026-07-09"
  },
  {
    "id": "a25",
    "title": "챗GPT 구독 할인받는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "우회 결제 사고 없이 챗GPT를 저렴하게 구독하는 방법.",
    "url": "https://zucca100.com/gpt-%ec%b1%97gpt-%ea%b0%80%ea%b2%a9-%ed%95%a0%ec%9d%b8-%ec%9d%b8%ed%95%98-%eb%ac%b4%eb%a3%8c-%ec%9a%94%ea%b8%88%ec%a0%9c-%ed%95%a0%ec%9d%b8-%eb%b0%9b%eb%8a%94-%eb%b2%95/",
    "date": "2026-07-09"
  },
  {
    "id": "a26",
    "title": "넷플릭스 구독 할인받는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "VPN 우회 없이 넷플릭스를 안전하게 할인받는 법.",
    "url": "https://zucca100.com/%eb%84%b7%ed%94%8c%eb%a6%ad%ec%8a%a4-%ea%b0%80%ea%b2%a9-%ed%95%a0%ec%9d%b8-%ec%9d%b8%ed%95%98-%eb%ac%b4%eb%a3%8c-%ec%9a%94%ea%b8%88%ec%a0%9c-%ed%95%a0%ec%9d%b8-%eb%b0%9b%eb%8a%94-%eb%b2%95/",
    "date": "2026-07-09"
  },
  {
    "id": "a27",
    "title": "유튜브 프리미엄 할인받는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "유튜브 프리미엄을 가장 저렴하게 이용하는 혜택 모음.",
    "url": "https://zucca100.com/%ec%9c%a0%ed%8a%9c%eb%b8%8c-%ed%94%84%eb%a6%ac%eb%af%b8%ec%97%84-%ed%95%a0%ec%9d%b8-%ea%b0%80%ea%b2%a9-%ec%9d%b8%ed%95%98-%eb%ac%b4%eb%a3%8c-%ea%b3%b5%ec%9c%a0/",
    "date": "2026-07-09"
  },
  {
    "id": "a28",
    "title": "한컴독스·한글 무료로 쓰는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "매달 돈 내던 한글 프로그램을 무료·최저가로 쓰는 법.",
    "url": "https://zucca100.com/%ed%95%9c%ec%bb%b4%eb%8f%85%ec%8a%a4-%ec%98%a4%ed%94%bc%ec%8a%a4-%ed%95%9c%ea%b8%802024-%ed%95%9c%ea%b8%80-2020-%ea%b0%80%ea%b2%a9-%ed%95%a0%ec%9d%b8-%ec%9d%b8%ed%95%98-%eb%ac%b4%eb%a3%8c-%ec%9a%94/",
    "date": "2026-07-09"
  },
  {
    "id": "a29",
    "title": "제미나이(Gemini) Pro 할인받는 법",
    "category": "핫딜",
    "situations": [],
    "regions": [
      "전국"
    ],
    "summary": "제미나이 프로를 최저가로 이용하는 최신 할인 방법.",
    "url": "https://zucca100.com/%ec%a0%9c%eb%af%b8%eb%82%98%ec%9d%b4-gemini-pro-%ed%94%84%eb%a1%9c-%ea%b0%80%ea%b2%a9-%ed%95%a0%ec%9d%b8-%ec%9d%b8%ed%95%98-%eb%ac%b4%eb%a3%8c-%ec%9a%94%ea%b8%88%ec%a0%9c-%ed%95%a0%ec%9d%b8-%eb%b0%9b/",
    "date": "2026-07-09"
  },
  {
    "id": "a30",
    "title": "희망리턴패키지 신청(소상공인 재기)",
    "category": "취업·일자리",
    "situations": [
      "소상공인",
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "폐업 소상공인의 재기·재취업을 돕는 희망리턴패키지 안내.",
    "url": "https://zucca100.com/hope-return-package/",
    "date": "2026-07-07"
  },
  {
    "id": "a31",
    "title": "소상공인 정책자금 융자",
    "category": "취업·일자리",
    "situations": [
      "소상공인"
    ],
    "regions": [
      "전국"
    ],
    "summary": "소상공인 대상 저리 정책자금 융자 신청 방법.",
    "url": "https://zucca100.com/sbiz24/",
    "date": "2026-03-27"
  },
  {
    "id": "a32",
    "title": "산후도우미 신청 방법·대상",
    "category": "지원금·수당",
    "situations": [
      "신혼·육아"
    ],
    "regions": [
      "전국"
    ],
    "summary": "산모·신생아 건강관리 산후도우미 지원 대상과 신청 방법.",
    "url": "https://zucca100.com/%ec%82%b0%ed%9b%84%eb%8f%84%ec%9a%b0%eb%af%b8-%ec%8b%a0%ec%b2%ad-%eb%b0%a9%eb%b2%95-%eb%b0%8f-%eb%8c%80%ec%83%81-%ec%84%9c%eb%a5%98/",
    "date": "2026-07-07"
  },
  {
    "id": "a33",
    "title": "부모급여 신청·지급액",
    "category": "지원금·수당",
    "situations": [
      "신혼·육아"
    ],
    "regions": [
      "전국"
    ],
    "summary": "0~1세 아동 부모급여 지급액과 신청 방법.",
    "url": "https://zucca100.com/2026-parent-benefit-guide/",
    "date": "2026-02-02"
  },
  {
    "id": "a34",
    "title": "첫만남이용권 신청·사용처",
    "category": "지원금·수당",
    "situations": [
      "신혼·육아"
    ],
    "regions": [
      "전국"
    ],
    "summary": "출산 시 지급되는 첫만남이용권 바우처 신청과 사용처.",
    "url": "https://zucca100.com/cheosmmannam-iyonggwon-sincheong/",
    "date": "2026-02-04"
  },
  {
    "id": "a35",
    "title": "공동주택가격 확인서 인터넷 발급",
    "category": "주거·세금",
    "situations": [
      "주거"
    ],
    "regions": [
      "전국"
    ],
    "summary": "공동주택가격 확인서 온라인 발급 방법.",
    "url": "https://zucca100.com/%ea%b3%b5%eb%8f%99%ec%a3%bc%ed%83%9d%ea%b0%80%ea%b2%a9%ed%99%95%ec%9d%b8%ec%84%9c-%ec%9d%b8%ed%84%b0%eb%84%b7-%eb%b0%9c%ea%b8%89-%eb%b0%a9%eb%b2%95-%ec%8b%a0%ec%b2%ad/",
    "date": "2026-07-07"
  },
  {
    "id": "a36",
    "title": "토지거래허가 조회·신청",
    "category": "주거·세금",
    "situations": [
      "주거"
    ],
    "regions": [
      "전국"
    ],
    "summary": "토지거래허가구역 조회와 허가 신청·서류 안내.",
    "url": "https://zucca100.com/land-seoul/",
    "date": "2026-07-02"
  },
  {
    "id": "a37",
    "title": "노령연금 신청·수급자격",
    "category": "지원금·수당",
    "situations": [
      "시니어"
    ],
    "regions": [
      "전국"
    ],
    "summary": "노령연금 신청 조건, 수급자격, 금액, 나이 정리.",
    "url": "https://zucca100.com/old-age-pension/",
    "date": "2026-07-06"
  },
  {
    "id": "a38",
    "title": "국민연금 예상수령액 조회",
    "category": "지원금·수당",
    "situations": [
      "시니어"
    ],
    "regions": [
      "전국"
    ],
    "summary": "내 국민연금 예상수령액을 조회하는 방법.",
    "url": "https://zucca100.com/%ea%b5%ad%eb%af%bc%ec%97%b0%ea%b8%88-%ec%98%88%ec%83%81%ec%88%98%eb%a0%b9%ec%95%a1-%ec%a1%b0%ed%9a%8c%ed%95%98%ea%b8%b0/",
    "date": "2026-07-07"
  },
  {
    "id": "a39",
    "title": "사학연금 수령액 조회·계산",
    "category": "지원금·수당",
    "situations": [
      "시니어"
    ],
    "regions": [
      "전국"
    ],
    "summary": "사학연금 수령액 조회와 계산 방법.",
    "url": "https://zucca100.com/%ec%82%ac%ed%95%99%ec%97%b0%ea%b8%88-%ec%88%98%eb%a0%b9%ec%95%a1-%ec%a1%b0%ed%9a%8c-%eb%b0%a9%eb%b2%95-%ea%b3%84%ec%82%b0/",
    "date": "2026-07-07"
  },
  {
    "id": "a40",
    "title": "국민취업지원제도 신청·요건",
    "category": "취업·일자리",
    "situations": [
      "구직·취업"
    ],
    "regions": [
      "전국"
    ],
    "summary": "국민취업지원제도 신청 방법과 소득요건 안내.",
    "url": "https://zucca100.com/korea-employment-support-type1-guide-2026/",
    "date": "2026-01-05"
  },
  {
    "id": "a41",
    "title": "내일로 KTX 패스 예매·가격",
    "category": "청년",
    "situations": [
      "청년"
    ],
    "regions": [
      "전국"
    ],
    "summary": "청년 대상 내일로 KTX 3일권·7일권 예매 방법과 가격.",
    "url": "https://zucca100.com/%eb%82%b4%ec%9d%bc%eb%a1%9c-ktx-3%ec%9d%bc%ea%b6%8c-7%ec%9d%bc%ea%b6%8c-%ec%98%88%eb%a7%a4-%eb%b0%a9%eb%b2%95-%ea%b0%80%ea%b2%a9-%eb%82%98%ec%9d%b4/",
    "date": "2026-07-08"
  }
];

export function formatDate(d) {
  return d ? d.replace(/-/g, '.') : '';
}
