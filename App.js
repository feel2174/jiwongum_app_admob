import React, { useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform, Text, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  useNavigationContainerRef,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mobileAds from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import AppSplash from './src/components/AppSplash';

import { useTheme } from './src/theme';
import { StoreProvider, useStore } from './src/lib/store';
import { NOTIFICATION_SETTING_KEY } from './src/lib/storage';
import { init as initAds, setAdsEnabled } from './src/lib/adManager';
import { checkIntegrity, adsAllowedByIntegrity } from './src/lib/integrity';
import { loadRemoteConfig, refreshRemoteConfig, DEFAULTS as REMOTE_DEFAULTS } from './src/lib/remoteConfig';
import { openContent } from './src/lib/openLink';
import { getPushPermissionStatus, requestPushPermission, syncPushPermission } from './src/lib/push';

import DetailScreen from './src/screens/DetailScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import SavedScreen from './src/screens/SavedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WebScreen from './src/screens/WebScreen';
import RemoteNotices from './src/components/RemoteNotices';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 네이티브 스플래시가 JS 준비 전에 사라지지 않게 막아둔다(코드 스플래시로 교체하기 위함).
SplashScreen.preventAutoHideAsync().catch(() => {});

// 음성 검색용 마이크 권한. Android는 앱에 권한이 있어야 웹뷰가 웹 콘텐츠에 마이크를 허용한다.
// (iOS는 웹뷰가 실제로 마이크를 쓸 때 OS가 요청 — mediaCapturePermissionGrantType 참고.)
async function ensureMicPermission() {
  if (Platform.OS !== 'android') return;
  try {
    const has = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    if (has) return;
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: '마이크 사용 권한',
      message: '음성으로 지원금을 검색하려면 마이크 권한이 필요해요.',
      buttonPositive: '허용',
      buttonNegative: '나중에',
    });
  } catch {}
}

function Tabs({ initialRouteName = 'Home' }) {
  const t = useTheme();

  // 현재 탭을 아이콘 뒤 알약형 배경 + 굵은 글자로 부각한다.
  // (반투명 블러는 저시력 사용자에게 대비가 낮아지므로, 대비가 뚜렷한 단색 하이라이트를 쓴다.)
  const tabIcon = (emoji) => ({ color, focused }) => (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? t.accentSoft : 'transparent',
      }}
    >
      <Text style={{ fontSize: 18, color }}>{emoji}</Text>
    </View>
  );
  const tabLabel = (label) => ({ color, focused }) => (
    <Text style={{ fontSize: 12, color, fontWeight: focused ? '800' : '500', marginTop: 2 }}>
      {label}
    </Text>
  );

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.faint,
        tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={WebScreen}
        initialParams={{
          url: 'https://www.senior.zucca100.com',
          title: '홈',
          showBack: false,
          showHeader: false,
        }}
        options={{ tabBarLabel: tabLabel('홈'), tabBarIcon: tabIcon('🏠') }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{ tabBarLabel: tabLabel('저장함'), tabBarIcon: tabIcon('⭐') }}
      />
      <Tab.Screen
        name="Ask"
        component={WebScreen}
        initialParams={{
          url: 'https://www.senior.zucca100.com/help',
          title: '문의',
          showBack: false,
          showHeader: false,
        }}
        options={{ tabBarLabel: tabLabel('문의'), tabBarIcon: tabIcon('💬') }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        initialParams={{ showBack: false }}
        options={{ tabBarLabel: tabLabel('설정'), tabBarIcon: tabIcon('⚙') }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { profile, ready, settings, setSetting, completeOnboarding } = useStore();
  const t = useTheme();
  const notifOn = !!settings[NOTIFICATION_SETTING_KEY];

  // 온보딩(혜택 선택) 화면 제거 — 최초 접속도 곧바로 홈으로 들어간다.
  // 권한 요청 등 onboarded 기반 로직이 계속 동작하도록 조용히 완료 처리한다.
  useEffect(() => {
    if (ready && !profile.onboarded) completeOnboarding([], '전국');
  }, [ready, profile.onboarded, completeOnboarding]);

  // 앱 사용 시 알림·마이크 권한을 확보한다.
  // - 알림: 이미 허용돼 있으면 기본으로 켜고(토글 ON), 미결정이면 1회 요청 후 허용 시 켠다.
  // - 마이크: Android에서 음성 검색용으로 요청.
  useEffect(() => {
    if (!ready || !profile.onboarded) return undefined;

    let mounted = true;

    (async () => {
      try {
        const status = await getPushPermissionStatus();
        // 권한 요청/확인만 하고, 토큰 등록(getExpoPushTokenAsync)은 아래 sync effect 한 곳에서만 수행한다.
        if (status === 'granted') {
          if (mounted) setSetting(NOTIFICATION_SETTING_KEY, true);
        } else if (status === 'undetermined') {
          const granted = await requestPushPermission();
          if (mounted && granted) setSetting(NOTIFICATION_SETTING_KEY, true);
        }
      } catch {}
      await ensureMicPermission();
    })();

    return () => {
      mounted = false;
    };
  }, [ready, profile.onboarded, setSetting]);

  useEffect(() => {
    if (!ready || !profile.onboarded) return undefined;

    let mounted = true;

    const syncNotifications = async ({ requestIfNeeded }) => {
      if (!notifOn) return;
      try {
        const enabled = await syncPushPermission({ requestIfNeeded });
        if (mounted) setSetting(NOTIFICATION_SETTING_KEY, enabled);
      } catch {}
    };

    syncNotifications({ requestIfNeeded: false });

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        syncNotifications({ requestIfNeeded: false });
      }
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, [ready, profile.onboarded, notifOn, setSetting]);

  if (!ready) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs">
        {() => <Tabs initialRouteName="Home" />}
      </Stack.Screen>
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="Collection" component={CollectionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Web" component={WebScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const navRef = useNavigationContainerRef();
  const scheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const [remoteCfg, setRemoteCfg] = useState(REMOTE_DEFAULTS);

  // 네이티브 스플래시를 감추고, 코드로 그린 스플래시(노란 배경 + Senior Support)를 잠깐 보여준다.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    const timer = setTimeout(() => setShowSplash(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try { await requestTrackingPermissionsAsync(); } catch {}
      try { await mobileAds().initialize(); } catch {}
      initAds();

      // 원격설정(킬 스위치) + 무결성 소프트 게이트로 광고 on/off 결정.
      // 콜드 스타트 1회. 실패해도 안전한 기본값(광고 on, 콘텐츠 정상)으로 폴백.
      try {
        const cached = await loadRemoteConfig(); // 캐시 즉시 반영(오프라인 대비)
        setRemoteCfg(cached);
        const [verdict, cfg] = await Promise.all([checkIntegrity(), refreshRemoteConfig()]);
        setRemoteCfg(cfg);
        setAdsEnabled(cfg.adsEnabled !== false && adsAllowedByIntegrity(verdict));
      } catch {
        setAdsEnabled(true);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data = resp.notification.request.content.data || {};
      if (data.articleId && navRef.isReady()) navRef.navigate('Detail', { id: data.articleId });
      else if (data.url && navRef.isReady()) openContent(navRef, data.url);
    });

    return () => sub.remove();
  }, [navRef]);

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer ref={navRef} theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigator />
        </NavigationContainer>
        <RemoteNotices cfg={remoteCfg} />
        <StatusBar style="auto" />
      </StoreProvider>
      {showSplash ? <AppSplash /> : null}
    </SafeAreaProvider>
  );
}
