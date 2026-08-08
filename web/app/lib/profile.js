'use client';

// 내 조건 저장(재방문 기능 ②). 지금은 '지역'만 실제 필터에 사용한다.
// (나이 기반 필터는 gov24 목록에 신뢰할 만한 연령 필드가 없어 보류 — 가짜 컨트롤을 만들지 않는다.)

const REGION_KEY = 'senior-region';

export const REGIONS = [
  '전국', '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도',
  '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도',
  '제주특별자치도',
];

export function getRegion() {
  if (typeof window === 'undefined') return '전국';
  return window.localStorage.getItem(REGION_KEY) || '전국';
}

export function setRegion(region) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REGION_KEY, region);
}
