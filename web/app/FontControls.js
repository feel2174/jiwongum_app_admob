'use client';

import { useEffect, useState } from 'react';

const sizes = [
  { key: 'normal', label: '기본', value: 0 },
  { key: 'large', label: '크게', value: 1 },
  { key: 'xlarge', label: '더 크게', value: 2 },
];

export default function FontControls() {
  const [selected, setSelected] = useState('normal');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('senior-font-size') || 'normal';
    setSelected(stored);
    document.documentElement.dataset.fontScale = stored;
  }, []);

  function changeSize(size) {
    setSelected(size);
    document.documentElement.dataset.fontScale = size;
    window.localStorage.setItem('senior-font-size', size);
  }

  const selectedIndex = sizes.find((size) => size.key === selected)?.value ?? 0;

  return (
    <div className={`fontControls floatingFontControls ${expanded ? 'isOpen' : 'isCollapsed'}`} aria-label="글자 크기 조절">
      {!expanded ? (
        <button
          type="button"
          className="fontToggle"
          aria-label="글자 크기 조절 열기"
          onClick={() => setExpanded(true)}
        >
          가
        </button>
      ) : (
        <>
          <div className="fontHeader">
            <span className="fontTitle">글자 크기</span>
            <button type="button" className="fontClose" onClick={() => setExpanded(false)}>
              접기
            </button>
          </div>
          <div className="fontSliderRow">
            <button
              type="button"
              aria-label="글자 작게"
              onClick={() => changeSize(sizes[Math.max(0, selectedIndex - 1)].key)}
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={selectedIndex}
              aria-label="글자 크기"
              onChange={(event) => changeSize(sizes[Number(event.target.value)].key)}
            />
            <button
              type="button"
              aria-label="글자 크게"
              onClick={() => changeSize(sizes[Math.min(sizes.length - 1, selectedIndex + 1)].key)}
            >
              +
            </button>
          </div>
          <strong>{sizes[selectedIndex].label}</strong>
        </>
      )}
    </div>
  );
}
