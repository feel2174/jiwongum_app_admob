import { Platform } from 'react-native';

// Bridge to the local Expo module in modules/webview-ads.
// Android only; unsupported environments quietly skip registration.
let nativeModule = null;

if (Platform.OS === 'android') {
  try {
    const { requireNativeModule } = require('expo-modules-core');
    nativeModule = requireNativeModule('WebviewAds');
  } catch (e) {
    console.warn('WebviewAds native module unavailable:', e.message);
  }
}

// Register mounted WebViews with the Mobile Ads SDK before loading web content.
export async function registerWebViewForAds() {
  if (!nativeModule) {
    return false;
  }

  try {
    const count = await nativeModule.registerWebViews();
    return count > 0;
  } catch (e) {
    console.warn('registerWebViewForAds failed:', e.message);
    return false;
  }
}
