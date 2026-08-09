'use client';

import { useEffect, useState } from 'react';

// 홈 검색창 아래 '오늘의 혜택' 카드.
// - 어드민이 app_settings(todays_benefit)로 제어한다: 표시 on/off + 기본 설명 문구 + 직접 추가한 항목(items).
// - items가 하나라도 있으면 그 항목들을 노출한다. 없으면 최신 발행글(24시간 이내)로 대체.
// - anon 키는 공개용(RLS로 접근 제어). 발행글(published=true)만 읽힌다.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oxunynxspkxfkokerftl.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_T_IYdewX-mBILr-5hSIUxw_0KC4f3Nh';
const DAY_MS = 24 * 60 * 60 * 1000;

export default function NewBenefitCard() {
  // items: [{ id, title, note, url }] — 어드민이 직접 넣은 항목 또는 최신 발행글 1건
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
        const [aRes, cRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/articles`
            + '?select=title,url,created_at&published=eq.true&order=created_at.desc&limit=1', { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/app_settings?key=eq.todays_benefit&select=value`, { headers }),
        ]);

        // 어드민 설정: 표시 on/off + 기본 설명 문구 + 직접 추가한 항목
        let enabled = true;
        let note = '';
        let manualItems = [];
        if (cRes.ok) {
          const cfg = (await cRes.json())?.[0]?.value;
          if (cfg) {
            enabled = cfg.enabled !== false;
            note = typeof cfg.note === 'string' ? cfg.note : '';
            if (Array.isArray(cfg.items)) manualItems = cfg.items;
          }
        }
        if (!enabled) return; // 어드민이 꺼둠 → 숨김

        // ① 어드민이 직접 넣은 항목이 있으면 그대로 노출
        const usable = manualItems
          .filter((it) => it && (it.note || it.url))
          .map((it) => ({ id: it.id, title: it.title || '오늘의 혜택', note: it.note || '', url: it.url || '' }));
        if (usable.length > 0) {
          if (alive) setItems(usable);
          return;
        }

        // ② 없으면 최신 발행글(24시간 이내)로 대체
        if (!aRes.ok) return;
        const latest = (await aRes.json())?.[0];
        if (!latest?.url || !latest?.created_at) return;
        if (Date.now() - new Date(latest.created_at).getTime() > DAY_MS) return;

        if (alive) setItems([{ id: 'latest', title: latest.title, note, url: latest.url }]);
      } catch {
        /* 실패 시 조용히 숨김 */
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="landingCard todayCard" aria-label="오늘의 혜택">
      <p className="eyebrow">오늘의 혜택</p>
      {items.map((it, i) => (
        <div key={it.id || i} style={i > 0 ? { marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,253,248,0.18)' } : undefined}>
          <h2>{it.title}</h2>
          {it.note ? <p className="todaysSummary">{it.note}</p> : null}
          {/* 앱 내 웹뷰(현재 탭)에서 열리도록 target="_blank" 제외 */}
          {it.url ? <a className="readButton" href={it.url}>자세히 보기</a> : null}
        </div>
      ))}
    </section>
  );
}
