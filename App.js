import React, { useEffect } from 'react';
import { Text, View, useColorScheme } from 'react-native';
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
import { init as initAds } from './src/lib/adManager';
import { openExternal } from './src/lib/openLink';
import { syncPushTokenIfPermitted } from './src/lib/push';

import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import SearchScreen from './src/screens/SearchScreen';
import SavedScreen from './src/screens/SavedScreen';
import DetailScreen from './src/screens/DetailScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcon = (emoji) => ({ color }) => <Text style={{ fontSize: 18, color }}>{emoji}</Text>;

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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈', tabBarIcon: tabIcon('🏠') }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ tabBarLabel: '탐색', tabBarIcon: tabIcon('🧭') }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색', tabBarIcon: tabIcon('🔍') }} />
      <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarLabel: '저장', tabBarIcon: tabIcon('🔖') }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { profile, ready } = useStore();
  const t = useTheme();

  if (!ready) return <View style={{ flex: 1, backgroundColor: t.bg }} />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!profile.onboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Collection" component={CollectionScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
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
      syncPushTokenIfPermitted();
    })();
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((resp) => {
      const data = resp.notification.request.content.data || {};
      if (data.url) openExternal(data.url);
      else if (data.articleId && navRef.isReady()) navRef.navigate('Detail', { id: data.articleId });
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
