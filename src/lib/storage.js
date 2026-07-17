import AsyncStorage from '@react-native-async-storage/async-storage';

const K_BOOKMARKS = '@jiwongum/bookmarks';
const K_SETTINGS = '@jiwongum/settings';
const K_PROFILE = '@jiwongum/profile';
const K_ARTICLES_CACHE = '@jiwongum/articles-cache';
const K_NEWS_CACHE = '@jiwongum/breaking-news-cache';

export const NOTIFICATION_SETTING_KEY = 'newPostNotifications';

export const DEFAULT_SETTINGS = {
  [NOTIFICATION_SETTING_KEY]: false,
};

export const DEFAULT_PROFILE = {
  situations: [],
  region: '전국',
  onboarded: false,
};

async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

async function saveJSON(key, val) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export async function loadBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(K_BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(arr) {
  return saveJSON(K_BOOKMARKS, arr);
}

export function loadSettings() {
  return loadJSON(K_SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(obj) {
  return saveJSON(K_SETTINGS, obj);
}

export function loadProfile() {
  return loadJSON(K_PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(obj) {
  return saveJSON(K_PROFILE, obj);
}

export async function loadArticlesCache() {
  try {
    const raw = await AsyncStorage.getItem(K_ARTICLES_CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveArticlesCache(arr) {
  return saveJSON(K_ARTICLES_CACHE, arr);
}

export async function loadNewsCache() {
  try {
    const raw = await AsyncStorage.getItem(K_NEWS_CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveNewsCache(arr) {
  return saveJSON(K_NEWS_CACHE, arr);
}
