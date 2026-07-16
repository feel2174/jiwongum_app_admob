package expo.modules.webviewads

import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.gms.ads.MobileAds
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Google "WebView API for Ads" 연동 — react-native-webview의 네이티브 WebView를
// Mobile Ads SDK에 등록해 WebView 안 AdSense/GPT 광고에 앱 신호를 제공한다.
// https://developers.google.com/admob/android/browser/webview/api-for-ads
class WebviewAdsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WebviewAds")

    AsyncFunction("registerWebView") { viewTag: Int, promise: Promise ->
      val reactContext = appContext.reactContext as? ReactContext
      if (reactContext == null) {
        promise.reject("ERR_NO_CONTEXT", "React context unavailable", null)
        return@AsyncFunction
      }
      reactContext.runOnUiQueueThread {
        try {
          val uiManager = UIManagerHelper.getUIManagerForReactTag(reactContext, viewTag)
          val root = uiManager?.resolveView(viewTag)
          val webView = findWebView(root)
          if (webView != null) {
            MobileAds.registerWebView(webView)
            promise.resolve(true)
          } else {
            promise.reject("ERR_NO_WEBVIEW", "No WebView found for tag $viewTag", null)
          }
        } catch (e: Throwable) {
          promise.reject("ERR_REGISTER", e.message ?: "registerWebView failed", e)
        }
      }
    }
  }

  // react-native-webview 13.x는 WebView를 래퍼(FrameLayout) 안에 두므로 재귀 탐색
  private fun findWebView(view: View?): WebView? {
    if (view == null) return null
    if (view is WebView) return view
    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        findWebView(view.getChildAt(i))?.let { return it }
      }
    }
    return null
  }
}
