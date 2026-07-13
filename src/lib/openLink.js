import { Linking } from 'react-native';
import { gateThenOpen } from './adManager';

// "자세히 보기" / 뉴스 열기 (zucca100.com 등).
// 광고 판정(gateThenOpen)을 거친 뒤, 앱을 벗어나 기기 기본 브라우저(크롬 등)로 오픈한다.
// 앱 WebView 임베드가 아니라 실제 외부 브라우저라 AdSense가 정상 노출되고 정책상도 안전.
export function openExternal(url) {
  const full = /^https?:\/\//i.test(url) ? url : 'https://' + url;
  gateThenOpen(() => {
    Linking.openURL(full).catch(() => {});
  });
}
