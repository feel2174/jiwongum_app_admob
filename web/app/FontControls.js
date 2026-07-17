'use client';

import { useEffect, useState } from 'react';

const sizes = [
  { key: 'normal', label: '기본' },
  { key: 'large', label: '크게' },
  { key: 'xlarge', label: '더 크게' },
];

export default function FontControls() {
  const [selected, setSelected] = useState('normal');

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

  return (
    <div className="fontControls" aria-label="글자 크기 조절">
      <span>글자 크기</span>
      <div>
        {sizes.map((size) => (
          <button
            key={size.key}
            type="button"
            aria-pressed={selected === size.key}
            onClick={() => changeSize(size.key)}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
