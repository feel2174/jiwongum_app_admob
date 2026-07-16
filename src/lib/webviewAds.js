import { Platform } from 'react-native';

// 로컬 Expo 모듈(modules/webview-ads) 브릿지.
// Android에서만 동작(WebView API for Ads). 미지원 환경에선 조용히 no-op.
let nativeModule = null;
if (Platform.OS === 'android') {
  try {
    const { requireNativeModule } = require('expo-modules-core');
    nativeModule = requireNativeModule('WebviewAds');
  } catch (e) {
    console.warn('WebviewAds native module unavailable:', e.message);
  }
}

// viewTag: findNodeHandle(webViewRef.current). 콘텐츠 로드 "전"에 호출할 것(Google 권장).
export async function registerWebViewForAds(viewTag) {
  if (!nativeModule || viewTag == null) return false;
  try {
    return await nativeModule.registerWebView(viewTag);
  } catch (e) {
    console.warn('registerWebViewForAds failed:', e.message);
    return false;
  }
}
