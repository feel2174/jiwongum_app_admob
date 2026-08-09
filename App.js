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

import { useTheme } from './src/theme';
import { StoreProvider, useStore } from './src/lib/store';
import { NOTIFICATION_SETTING_KEY } from './src/lib/storage';
import { init as initAds } from './src/lib/adManager';
import { openContent } from './src/lib/openLink';
import { getPushPermissionStatus, syncPushPermission } from './src/lib/push';

import DetailScreen from './src/screens/DetailScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WebScreen from './src/screens/WebScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const tabIcon = (emoji) => ({ color }) => <Text style={{ fontSize: 18, color }}>{emoji}</Text>;

function Tabs({ initialRouteName = 'Home' }) {
  const t = useTheme();

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
        options={{ tabBarLabel: '홈', tabBarIcon: tabIcon('🏠') }}
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
        options={{ tabBarLabel: '문의', tabBarIcon: tabIcon('💬') }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        initialParams={{ showBack: false }}
        options={{ tabBarLabel: '설정', tabBarIcon: tabIcon('⚙') }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { profile, ready, settings, setSetting, completeOnboarding } = useStore();
  const t = useTheme();
  const notifOn = !!settings[NOTIFICATION_SETTING_KEY];
  const [initialTab, setInitialTab] = useState(null);

  // 온보딩(혜택 선택) 화면 제거 — 최초 접속도 곧바로 앱으로 들어간다.
  // 권한 요청 등 onboarded 기반 로직이 계속 동작하도록 조용히 완료 처리한다.
  useEffect(() => {
    if (ready && !profile.onboarded) completeOnboarding([], '전국');
  }, [ready, profile.onboarded, completeOnboarding]);

  useEffect(() => {
    if (!ready || !profile.onboarded) return undefined;

    let mounted = true;

    (async () => {
      try {
        const status = await getPushPermissionStatus();
        if (mounted) setInitialTab(status === 'granted' ? 'Home' : 'SettingsTab');
      } catch {
        if (mounted) setInitialTab('Home');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [ready, profile.onboarded]);

  // 앱 사용 시 알림·마이크 권한을 확보한다. 알림은 미결정이면 1회 요청, 마이크는 Android에서 요청.
  useEffect(() => {
    if (!ready || !profile.onboarded) return undefined;

    let mounted = true;

    (async () => {
      try {
        const status = await getPushPermissionStatus();
        if (status === 'undetermined') {
          const granted = await syncPushPermission({ requestIfNeeded: true });
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

  if (!ready || (profile.onboarded && !initialTab)) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs">
        {() => <Tabs initialRouteName={initialTab || 'Home'} />}
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

  useEffect(() => {
    (async () => {
      try { await requestTrackingPermissionsAsync(); } catch {}
      try { await mobileAds().initialize(); } catch {}
      initAds();
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
        <StatusBar style="auto" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
