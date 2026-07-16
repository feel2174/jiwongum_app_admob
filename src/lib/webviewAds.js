import { Alert, Platform } from 'react-native';
import { USE_TEST_ADS } from './adManager';

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
// 테스트 빌드(USE_TEST_ADS)에서는 결과를 Alert로 표시해 Metro 없이도 검증 가능.
export async function registerWebViewForAds(viewTag) {
  if (!nativeModule || viewTag == null) {
    if (USE_TEST_ADS) Alert.alert('WebView 광고', '네이티브 모듈 없음 (등록 생략)');
    return false;
  }
  try {
    await nativeModule.registerWebView(viewTag);
    if (USE_TEST_ADS) Alert.alert('WebView 광고', '등록 성공 ✅ (registerWebView)');
    return true;
  } catch (e) {
    console.warn('registerWebViewForAds failed:', e.message);
    if (USE_TEST_ADS) Alert.alert('WebView 광고', '등록 실패 ❌ — ' + e.message);
    return false;
  }
}
