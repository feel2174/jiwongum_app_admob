import React, { useEffect, useState } from 'react';
import { AppState, Text, View, useColorScheme } from 'react-native';
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

import OnboardingScreen from './src/screens/OnboardingScreen';
import BreakingNewsScreen from './src/screens/BreakingNewsScreen';
import DetailScreen from './src/screens/DetailScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WebScreen from './src/screens/WebScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
        name="SettingsTab"
        component={SettingsScreen}
        initialParams={{ showBack: false }}
        options={{ tabBarLabel: '설정', tabBarIcon: tabIcon('⚙') }}
      />
      <Tab.Screen name="More" component={BreakingNewsScreen} options={{ tabBarLabel: '기타', tabBarIcon: tabIcon('⋯') }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { profile, ready, settings, setSetting } = useStore();
  const t = useTheme();
  const notifOn = !!settings[NOTIFICATION_SETTING_KEY];
  const [initialTab, setInitialTab] = useState(null);

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
      {!profile.onboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Tabs">
            {() => <Tabs initialRouteName={initialTab || 'Home'} />}
          </Stack.Screen>
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Collection" component={CollectionScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Web" component={WebScreen} />
        </>
      )}
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
