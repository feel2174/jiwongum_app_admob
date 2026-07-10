import * as WebBrowser from 'expo-web-browser';
import { gateThenOpen } from './adManager';

// 글 열기 (zucca100.com).
// 광고 판정(gateThenOpen)을 거친 뒤 시스템 인앱 브라우저로 오픈한다.
// 앱 WebView에 임베드하지 않고 SFSafariViewController/Custom Tabs로 열어
// 블로그(웹·AdSense)를 합법적으로 노출한다.
export function openExternal(url) {
  const full = /^https?:\/\//i.test(url) ? url : 'https://' + url;
  gateThenOpen(() => {
    WebBrowser.openBrowserAsync(full).catch(() => {});
  });
}
