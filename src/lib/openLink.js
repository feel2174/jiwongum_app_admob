import { Linking } from 'react-native';
import { gateThenOpen } from './adManager';

// 지원금 "자세히 보기"는 보조금24 공식 포털로 연결.
// zucca100.com으로 향하는 모든 경로(상세·속보 폴백·푸시 탭 등)는 여기서 전부 이 포털로 대체된다.
export const SUBSIDY_PORTAL_URL = 'https://plus.gov.kr/portal/benefitV2';

export function openExternal(url) {
  let full = /^https?:\/\//i.test(url) ? url : url ? 'https://' + url : '';
  if (!full || /zucca100\.com/i.test(full)) full = SUBSIDY_PORTAL_URL;
  gateThenOpen(() => {
    Linking.openURL(full).catch(() => {});
  });
}
