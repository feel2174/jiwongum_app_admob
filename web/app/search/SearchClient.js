'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getRegion, setRegion as saveRegion, REGIONS } from '../lib/profile';
import {
  cacheResults, getCachedResults, cachePopular, getCachedPopular,
} from '../lib/searchCache';

// 자주 찾는 항목 — 타이핑 부담을 없애기 위해 검색창보다 위에 대형 색상 버튼으로.
const QUICK = [
  { key: '기초연금', icon: '💰', tone: 'pension' },
  { key: '의료비', icon: '🏥', tone: 'medical' },
  { key: '주거', icon: '🏠', tone: 'housing' },
  { key: '일자리', icon: '💼', tone: 'job' },
  { key: '난방비', icon: '🔥', tone: 'heating' },
];

// 결과 상단 안내 문구 (모드별)
const BANNER = {
  search: (q, n) => `‘${q}’ 검색 결과 ${n}건이에요.`,
  popular: (q) => `‘${q}’ 결과가 없어요. 많이 찾는 지원금을 보여드려요.`,
  cache: () => '연결이 잠시 어려워, 최근에 본 결과를 보여드려요.',
  errorPopular: () => '연결이 잠시 어려워, 많이 찾는 지원금을 보여드려요.',
};

// value는 문자열 배열(구두점 기준 재정렬된 줄) 또는 문자열. 1줄이면 문장, 여러 줄이면 목록.
function Field({ label, value, children }) {
  const hasValue = Array.isArray(value) ? value.length > 0 : !!value;
  if (!hasValue && !children) return null;
  return (
    <div className="sumRow">
      <span className="sumLabel">{label}</span>
      <div className="sumValue">
        {Array.isArray(value)
          ? (value.length === 1
            ? <span>{value[0]}</span>
            : <ul className="sumBullets">{value.map((v, i) => <li key={i}>{v}</li>)}</ul>)
          : (value ? <span>{value}</span> : null)}
        {children}
      </div>
    </div>
  );
}

function ResultCard({ item }) {
  return (
    <li className="resultCard">
      <h3 className="resultTitle">{item.name}</h3>
      <p className="resultOrg">{item.org}</p>
      {item.deadline ? (
        <p className="resultMeta"><span className="metaTag">신청기한</span> {item.deadline}</p>
      ) : null}

      <div className="sumCard">
        <Field label="대상" value={item.target} />
        <Field label="금액" value={item.amount} />
        <Field label="신청방법" value={item.method} />
        <Field label="신청처" value={item.receiver}>
          {item.phone ? (
            <a className="telButton" href={`tel:${item.phone}`}>📞 {item.phone} 전화</a>
          ) : null}
        </Field>
      </div>

      {item.url ? (
        <div className="resultActions">
          {/* 앱 내 웹뷰(인앱 브라우저) 현재 탭에서 열리도록 target="_blank" 제외 */}
          <a className="resultButton" href={item.url}>
            자세히 보기(원문)
          </a>
        </div>
      ) : null}
    </li>
  );
}

export default function SearchClient() {
  const [draft, setDraft] = useState('');
  const [region, setRegionState] = useState('전국');
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [mode, setMode] = useState('search'); // search | popular | cache | errorPopular
  const [results, setResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const popularRef = useRef(null);
  const resultsRef = useRef(null);
  const recognitionRef = useRef(null);

  // 검색을 시작하면 결과 영역으로 부드럽게 스크롤(버튼 클릭 검색 포함).
  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  useEffect(() => {
    setRegionState(getRegion());
    // 음성 검색 지원 여부(브라우저/웹뷰에 Web Speech API가 있을 때만 노출)
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      setVoiceSupported(true);
    }
    // 인기 지원금 미리 확보(폴백 즉시성 + 오프라인 캐시 적재)
    (async () => {
      try {
        const res = await fetch('/api/popular');
        if (res.ok) {
          const data = await res.json();
          if (data.results?.length) {
            popularRef.current = data.results;
            cachePopular(data.results);
          }
        }
      } catch {
        /* 무시 — 필요 시 캐시에서 읽음 */
      }
    })();
  }, []);

  const ensurePopular = useCallback(async () => {
    if (popularRef.current?.length) return popularRef.current;
    try {
      const res = await fetch('/api/popular');
      if (res.ok) {
        const data = await res.json();
        if (data.results?.length) {
          popularRef.current = data.results;
          cachePopular(data.results);
          return data.results;
        }
      }
    } catch {
      /* 아래 캐시 폴백 */
    }
    return getCachedPopular();
  }, []);

  const runSearch = useCallback(async (keyword) => {
    const q = (keyword ?? draft).trim();
    if (!q) return;
    setDraft(q);
    setLastQuery(q);
    setStatus('loading');
    scrollToResults();

    const params = new URLSearchParams({ q });
    const r = getRegion();
    if (r && r !== '전국') params.set('region', r);

    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();

      if (data.results?.length > 0) {
        setResults(data.results);
        setMode('search');
        cacheResults(q, data.results);
      } else {
        // 0건 → 인기 지원금 대체 노출
        const pop = await ensurePopular();
        setResults(pop || []);
        setMode('popular');
      }
      setStatus('done');
    } catch {
      // API 실패 → 로컬 캐시 폴백 (빈 화면 금지)
      const cached = getCachedResults(q);
      if (cached?.length) {
        setResults(cached);
        setMode('cache');
        setStatus('done');
        return;
      }
      const pop = await ensurePopular();
      if (pop?.length) {
        setResults(pop);
        setMode('errorPopular');
        setStatus('done');
        return;
      }
      setStatus('error');
    }
  }, [draft, ensurePopular, scrollToResults]);

  // 음성 검색: 말하면 인식된 텍스트로 바로 검색.
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SR();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setDraft(transcript);
        runSearch(transcript);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }, [listening, runSearch]);

  function onRegionChange(next) {
    setRegionState(next);
    saveRegion(next);
    if (lastQuery) runSearch(lastQuery); // 저장한 지역으로 즉시 다시 검색
  }

  const bannerText = status === 'done'
    ? (mode === 'search'
      ? BANNER.search(lastQuery, results.length)
      : mode === 'popular'
        ? BANNER.popular(lastQuery)
        : mode === 'cache'
          ? BANNER.cache()
          : BANNER.errorPopular())
    : '';

  return (
    <div className="searchPage">
      <section className="quickBlock" aria-label="자주 찾는 항목">
        <h2 className="searchLead">무엇을 찾으세요?</h2>
        <p className="searchGuide">아래 버튼을 누르거나, 검색어를 입력하세요.</p>
        <div className="quickGrid">
          {QUICK.map((q) => (
            <button
              key={q.key}
              type="button"
              className={`quickButton tone-${q.tone}`}
              onClick={() => runSearch(q.key)}
            >
              <span className="quickIcon" aria-hidden="true">{q.icon}</span>
              <span className="quickLabel">{q.key}</span>
            </button>
          ))}
        </div>
      </section>

      <form
        className="searchBar"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
      >
        <label htmlFor="benefitSearch" className="searchBarLabel">지원금 검색</label>
        <input
          id="benefitSearch"
          className="searchInput"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="예: 틀니, 보청기, 교통비"
          inputMode="search"
          enterKeyHint="search"
          maxLength={40}
        />
        <button type="submit" className="searchButton">검색</button>
      </form>

      {voiceSupported ? (
        <button
          type="button"
          className={`voiceButton ${listening ? 'isListening' : ''}`}
          onClick={startVoice}
          aria-pressed={listening}
        >
          <span className="voiceIcon" aria-hidden="true">🎤</span>
          {listening ? '듣고 있어요… (다시 누르면 멈춤)' : '말로 검색하기'}
        </button>
      ) : null}

      <div className="regionBar">
        <label htmlFor="regionSelect">내 지역</label>
        <select
          id="regionSelect"
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <span className="regionHint">지역을 정하면 다음에도 기억해요.</span>
      </div>

      <section className="results" aria-live="polite" ref={resultsRef}>
        {status === 'loading' ? (
          <div className="loadingBox">
            <span className="loadingSpinner" aria-hidden="true" />
            <p className="loadingText">찾고 있어요…</p>
            <p className="loadingSub">잠시만 기다려 주세요.</p>
          </div>
        ) : status === 'error' ? (
          <div className="resultMsg errorMsg">
            <p>연결에 문제가 있어요.</p>
            <button type="button" className="retryButton" onClick={() => runSearch(lastQuery)}>
              다시 시도
            </button>
          </div>
        ) : status === 'done' ? (
          <>
            <p className="resultCountLine">{bannerText}</p>
            <ul className="resultList">
              {results.map((item) => (
                <ResultCard key={item.id} item={item} />
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  );
}
