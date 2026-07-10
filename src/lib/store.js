import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loadBookmarks,
  saveBookmarks,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from './storage';

// 북마크 + 알림설정을 기기 로컬에 저장. (MVP는 계정 없이 동작)
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [b, s] = await Promise.all([loadBookmarks(), loadSettings()]);
      setBookmarks(b);
      setSettings(s);
      setReady(true);
    })();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  };

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveSettings(next);
      return next;
    });
  };

  const isBookmarked = (id) => bookmarks.includes(id);

  return (
    <StoreContext.Provider
      value={{ bookmarks, isBookmarked, toggleBookmark, settings, toggleSetting, ready }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
