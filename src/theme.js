import { useColorScheme } from 'react-native';

// 프로토타입과 동일한 팔레트. 라이트/다크 모두 지원.
export const palettes = {
  light: {
    bg: '#eef1f5', surface: '#ffffff', surface2: '#eef1f5', card: '#ffffff',
    ink: '#16202b', muted: '#586572', faint: '#8996a2',
    border: '#e0e5ea', line: '#eceff3',
    accent: '#1a5c8c', accentSoft: '#e4eef6',
    amber: '#9a6b16', amberSoft: '#f7edd8',
    danger: '#b0362b', dangerSoft: '#f7e4e1',
    ok: '#2c7a52', okSoft: '#e2f0e8',
    onAccent: '#ffffff',
  },
  dark: {
    bg: '#0c1116', surface: '#151d25', surface2: '#1c2731', card: '#151d25',
    ink: '#e7edf2', muted: '#9dabb7', faint: '#6f7e8b',
    border: '#26323d', line: '#212d37',
    accent: '#52a4dc', accentSoft: '#17303f',
    amber: '#d8a648', amberSoft: '#2e2513',
    danger: '#e5695c', dangerSoft: '#3a201d',
    ok: '#5cb888', okSoft: '#16301f',
    onAccent: '#0c1116',
  },
};

export function useTheme() {
  const scheme = useColorScheme();
  return palettes[scheme === 'dark' ? 'dark' : 'light'];
}

// 카드/섹션 공통 그림자 (모던, 은은하게)
export const shadow = {
  shadowColor: '#0b1a2b',
  shadowOpacity: 0.07,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 5 },
  elevation: 2,
};
