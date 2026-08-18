import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, StyleSheet, BackHandler, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../theme';
import { registerWebViewForAds } from '../lib/webviewAds';
import { areAdsEnabled } from '../lib/adManager';
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
  // 하드웨어 뒤로가기용 — 콜백이 stale 값을 읽지 않도록 ref로 추적
  const canGoBackRef = useRef(false);
  const [errored, setErrored] = useState(false);

  const onRefReady = useCallback(
    async (ref) => {
      webRef.current = ref;
      if (!ref || registeredRef.current) return;
      registeredRef.current = true;
      // 광고 소프트 게이트: 광고가 꺼져 있으면 웹뷰를 광고 SDK에 등록하지 않는다(콘텐츠는 그대로 로드).
      if (areAdsEnabled()) {
        await registerWebViewForAds(); // 마운트된 WebView를 뷰 트리에서 찾아 등록. 실패해도 콘텐츠는 정상 로드
      }
      setSourceUri(url);
    },
    [url],
  );

  // 안드로이드 하드웨어 뒤로가기: 웹 히스토리가 있으면 페이지 뒤로, 없으면 기본 동작(스택 pop/종료).
  // 이 화면이 포커스됐을 때만 가로챈다.
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const onBackPress = () => {
        if (canGoBackRef.current && webRef.current) {
          webRef.current.goBack();
          return true; // 이벤트 소비 — 앱이 종료되거나 탭이 바뀌지 않게 막음
        }
        return false; // 웹 히스토리가 없으면 기본 뒤로가기(스택 pop 또는 앱 종료)
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, []),
  );

  const onRetry = useCallback(() => {
    setErrored(false);
    if (webRef.current) webRef.current.reload();
    else setSourceUri(url);
  }, [url]);

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
        // 음성 검색용 마이크 접근 허용(iOS 15+). Android는 앱에 RECORD_AUDIO가 있으면 웹뷰가 자동 허용.
        mediaCapturePermissionGrantType="grant"
        // ──────────────────────────────
        setSupportMultipleWindows={false}
        startInLoadingState
        // tel:/sms:/mailto: 는 웹뷰가 처리하지 못하므로 OS 다이얼러/앱으로 넘긴다(§Phase2 tel: 처리).
        onShouldStartLoadWithRequest={(req) => {
          const u = req?.url || '';
          if (/^(tel:|sms:|mailto:)/i.test(u)) {
            Linking.openURL(u).catch(() => {});
            return false;
          }
          return true;
        }}
        onNavigationStateChange={(navState) => {
          canGoBackRef.current = navState.canGoBack;
        }}
        onLoadStart={() => setErrored(false)}
        onError={() => setErrored(true)}
        onHttpError={({ nativeEvent }) => {
          // 서버가 5xx 등 심각한 오류를 반환하면 안내 화면 노출
          if (nativeEvent?.statusCode >= 500) setErrored(true);
        }}
        onMessage={(event) => {
          // 웹의 "알림 켜기"(new benefit 알림 유도) → 설정 화면으로 이동
          try {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg?.type === 'enable-notifications') navigation.navigate('SettingsTab');
          } catch {}
        }}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={t.accent} />
          </View>
        )}
      />
      {errored ? (
        <View style={[styles.errorOverlay, { backgroundColor: t.bg }]}>
          <Text style={styles.errorEmoji}>📡</Text>
          <Text style={[styles.errorTitle, { color: t.ink }]}>연결에 문제가 있어요</Text>
          <Text style={[styles.errorText, { color: t.muted }]}>
            인터넷 연결을 확인한 뒤 다시 시도해 주세요.
          </Text>
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.retryBtn, { backgroundColor: t.accent, opacity: pressed ? 0.9 : 1 }]}
          >
            <Text style={[styles.retryLabel, { color: t.onAccent }]}>다시 시도</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorEmoji: { fontSize: 44, marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  errorText: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  retryBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  retryLabel: { fontSize: 16, fontWeight: '700' },
});
