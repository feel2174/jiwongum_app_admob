import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useTheme } from '../theme';
import { registerWebViewForAds } from '../lib/webviewAds';
import Header, { HeaderButton } from '../components/Header';

// 인앱 웹 화면 — zucca100.com 콘텐츠를 WebView API for Ads로 로드.
// Google 권장 설정: JavaScript·DOM Storage·서드파티 쿠키·미디어 자동재생 허용,
// 그리고 콘텐츠 로드 "전"에 MobileAds.registerWebView 등록.
export default function WebScreen({ route, navigation }) {
  const t = useTheme();
  const { url, title, showBack = true, showHeader = true } = route.params;
  const webRef = useRef(null);
  // 등록이 끝나기 전에는 콘텐츠를 로드하지 않는다 (about:blank → 등록 → 실제 URL)
  const [sourceUri, setSourceUri] = useState('about:blank');
  const registeredRef = useRef(false);

  const onRefReady = useCallback(
    async (ref) => {
      webRef.current = ref;
      if (!ref || registeredRef.current) return;
      registeredRef.current = true;
      await registerWebViewForAds(); // 마운트된 WebView를 뷰 트리에서 찾아 등록. 실패해도 콘텐츠는 정상 로드
      setSourceUri(url);
    },
    [url],
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: t.bg }}>
      {showHeader ? (
        <Header
          title={title || '자세히 보기'}
          left={showBack ? <HeaderButton label="←" onPress={() => navigation.goBack()} /> : null}
        />
      ) : null}
      <WebView
        ref={onRefReady}
        source={{ uri: sourceUri }}
        style={{ flex: 1, backgroundColor: t.bg }}
        // ── Google WebView 광고 권장 설정 ──
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        // ──────────────────────────────
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={t.accent} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
