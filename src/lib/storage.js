import AsyncStorage from '@react-native-async-storage/async-storage';

const K_BOOKMARKS = '@jiwongum/bookmarks';
const K_SETTINGS = '@jiwongum/settings';

export const DEFAULT_SETTINGS = {
  'AI·툴': true,
  'OTT·구독': true,
  '정부·행정': false,
  생활팁: false,
  '새 글 알림': true,
};

export async function loadBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(K_BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveBookmarks(arr) {
  try {
    await AsyncStorage.setItem(K_BOOKMARKS, JSON.stringify(arr));
  } catch {}
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(K_SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(obj) {
  try {
    await AsyncStorage.setItem(K_SETTINGS, JSON.stringify(obj));
  } catch {}
}
