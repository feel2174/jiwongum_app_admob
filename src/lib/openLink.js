import { Linking } from 'react-native';
import { gateThenOpen } from './adManager';

const normalize = (url) => (/^https?:\/\//i.test(url) ? url : url ? 'https://' + url : '');

// 콘텐츠 열기 (전면광고 판정 후):
// · zucca100.com → 인앱 WebView(WebView API for Ads 등록됨 → AdSense 합법 노출)
// · 그 외(네이버 뉴스 등) → 외부 브라우저
export function openContent(navigation, url, title) {
  const full = normalize(url);
  if (!full) return;
  gateThenOpen(() => {
    if (/zucca100\.com/i.test(full) && navigation) {
      navigation.navigate('Web', { url: full, title });
    } else {
      Linking.openURL(full).catch(() => {});
    }
  });
}

// 외부 브라우저로만 열기 (navigation 없는 곳에서 사용; 동일하게 광고 판정 거침)
export function openExternal(url) {
  const full = normalize(url);
  if (!full) return;
  gateThenOpen(() => {
    Linking.openURL(full).catch(() => {});
  });
}
