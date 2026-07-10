import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  loadBookmarks, saveBookmarks,
  loadSettings, saveSettings, DEFAULT_SETTINGS,
  loadProfile, saveProfile, DEFAULT_PROFILE,
} from './storage';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [b, s, p] = await Promise.all([loadBookmarks(), loadSettings(), loadProfile()]);
      setBookmarks(b);
      setSettings(s);
      setProfileState(p);
      setReady(true);
    })();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  };
  const isBookmarked = (id) => bookmarks.includes(id);

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveSettings(next);
      return next;
    });
  };

  const updateProfile = (partial) => {
    setProfileState((prev) => {
      const next = { ...prev, ...partial };
      saveProfile(next);
      return next;
    });
  };
  const completeOnboarding = (situations, region) =>
    updateProfile({ situations, region, onboarded: true });

  return (
    <StoreContext.Provider
      value={{
        bookmarks, isBookmarked, toggleBookmark,
        settings, toggleSetting,
        profile, updateProfile, completeOnboarding,
        ready,
      }}
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
