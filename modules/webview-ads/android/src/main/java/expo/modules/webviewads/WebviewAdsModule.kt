package expo.modules.webviewads

import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import com.google.android.gms.ads.MobileAds
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Google "WebView API for Ads" 연동 — 현재 Activity 뷰 트리의 WebView들을
// Mobile Ads SDK에 등록해 WebView 안 AdSense/GPT 광고에 앱 신호를 제공한다.
// React Native 클래스에 의존하지 않도록 뷰 트리 탐색 방식 사용(컴파일 의존성 최소화).
// https://developers.google.com/admob/android/browser/webview/api-for-ads
class WebviewAdsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WebviewAds")

    // 화면에 마운트된 WebView를 모두 찾아 등록. 등록된 개수를 반환.
    AsyncFunction("registerWebViews") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "Current activity unavailable", null)
        return@AsyncFunction
      }
      activity.runOnUiThread {
        try {
          val found = mutableListOf<WebView>()
          collectWebViews(activity.window?.decorView, found)
          found.forEach { MobileAds.registerWebView(it) }
          promise.resolve(found.size)
        } catch (e: Throwable) {
          promise.reject("ERR_REGISTER", e.message ?: "registerWebView failed", e)
        }
      }
    }
  }

  private fun collectWebViews(view: View?, out: MutableList<WebView>) {
    if (view == null) return
    if (view is WebView) {
      out.add(view)
      return
    }
    if (view is ViewGroup) {
      for (i in 0 until view.childCount) {
        collectWebViews(view.getChildAt(i), out)
      }
    }
  }
}
