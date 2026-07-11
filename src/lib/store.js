import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  loadBookmarks, saveBookmarks,
  loadSettings, saveSettings, DEFAULT_SETTINGS,
  loadProfile, saveProfile, DEFAULT_PROFILE,
  loadArticlesCache, saveArticlesCache,
  loadNewsCache, saveNewsCache,
} from './storage';
import { fetchArticles } from './content';
import { fetchBreakingNews } from './breakingNews';
import { news as newsFallback } from './reco';
import { SEED_ARTICLES } from '../data/mock';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [articles, setArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [ready, setReady] = useState(false);

  const refreshArticles = useCallback(async () => {
    const fresh = await fetchArticles();
    if (fresh) {
      setArticles(fresh);
      saveArticlesCache(fresh);
    }
  }, []);

  const refreshBreakingNews = useCallback(async () => {
    const fresh = await fetchBreakingNews();
    if (fresh && fresh.length > 0) {
      setBreakingNews(fresh);
      saveNewsCache(fresh);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [b, s, p, cachedArticles, cachedNews] = await Promise.all([
        loadBookmarks(), loadSettings(), loadProfile(), loadArticlesCache(), loadNewsCache(),
      ]);
      const initialArticles = cachedArticles && cachedArticles.length > 0 ? cachedArticles : SEED_ARTICLES;
      setBookmarks(b);
      setSettings(s);
      setProfileState(p);
      setArticles(initialArticles);
      // 뉴스 API 실패 시 지원금 글 상위 3개로 대체(reco.js의 기존 placeholder 로직 재사용)
      setBreakingNews(cachedNews && cachedNews.length > 0 ? cachedNews : newsFallback(initialArticles));
      setReady(true);
      refreshArticles();
      refreshBreakingNews();
    })();
  }, [refreshArticles, refreshBreakingNews]);

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
        articles, refreshArticles,
        breakingNews, refreshBreakingNews,
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
