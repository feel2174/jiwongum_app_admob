import React, { useEffect } from 'react';
import { Text, useColorScheme } from 'react-native';
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
import { StoreProvider } from './src/lib/store';
import { init as initAds } from './src/lib/adManager';
import { openExternal } from './src/lib/openLink';

import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import SavedScreen from './src/screens/SavedScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabIcon(emoji) {
  return ({ color }) => <Text style={{ fontSize: 18, color }}>{emoji}</Text>;
}

function Tabs() {
  const t = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.faint,
        tabBarStyle: { backgroundColor: t.surface, borderTopColor: t.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '홈', tabBarIcon: tabIcon('🏠') }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: '검색', tabBarIcon: tabIcon('🔍') }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{ tabBarLabel: '저장', tabBarIcon: tabIcon('🔖') }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarLabel: '알림', tabBarIcon: tabIcon('🔔') }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const navRef = useNavigationContainerRef();
  const scheme = useColorScheme();

  // 광고 초기화: ATT(iOS) 동의 요청 → AdMob 초기화 → 전면광고 프리로드
  useEffect(() => {
    (async () => {
      try {
        await requestTrackingPermissionsAsync();
      } catch {}
      try {
        await mobileAds().initialize();
      } catch {}
      initAds();
    })();
  }, []);

  // [속보] 푸시 탭 → 앱 재진입 → 기사 원문으로 연결
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data = resp.notification.request.content.data || {};
      if (data.url) {
        openExternal(data.url);
      } else if (data.subsidyId && navRef.isReady()) {
        navRef.navigate('Detail', { id: data.subsidyId });
      }
    });
    return () => sub.remove();
  }, [navRef]);

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer
          ref={navRef}
          theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
