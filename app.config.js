// 동적 Expo 설정. app.json 을 정적 기반으로 받아(`config`) 프로파일별 값만 덧씌운다.
//
//  - skipIntegrity (§2.2): 개발/프리뷰 빌드는 디버그 서명이라 Play Integrity가 항상
//    UNRECOGNIZED_VERSION 을 반환한다. production 프로파일에서만 무결성을 강제한다.
//  - 브랜드 전환(§Phase3): 이름/아이콘/스플래시 교체는 되돌릴 수 없는 편도 변경이라
//    카카오 사전 공지(§4)와 함께 진행해야 한다. 그래서 production 빌드에서는 기본적으로
//    구브랜드('지원금 모아보기')를 유지하고, dev/preview 에서만 새 브랜드로 테스트한다.
//    production 에서 새 브랜드를 내보내려면 EXPO_PUBLIC_REBRAND=1 로 명시적으로 켠다.
module.exports = ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE; // 로컬 dev 에서는 undefined
  const isProd = profile === 'production';

  const skipIntegrity = !isProd;
  const rebrand = !isProd || process.env.EXPO_PUBLIC_REBRAND === '1';

  const plugins = (config.plugins || []).map((p) => {
    if (rebrand && Array.isArray(p) && p[0] === 'expo-splash-screen') {
      return [
        'expo-splash-screen',
        {
          ...p[1],
          image: './assets/rebrand/splash-icon.png',
          dark: { ...(p[1].dark || {}), image: './assets/rebrand/splash-icon.png' },
        },
      ];
    }
    if (rebrand && Array.isArray(p) && p[0] === 'expo-notifications') {
      return ['expo-notifications', { ...p[1], icon: './assets/rebrand/notification-icon.png' }];
    }
    return p;
  });

  return {
    ...config,
    name: rebrand ? '어르신 지원금' : config.name,
    icon: rebrand ? './assets/rebrand/icon.png' : config.icon,
    android: {
      ...config.android,
      adaptiveIcon: rebrand
        ? {
            ...config.android.adaptiveIcon,
            foregroundImage: './assets/rebrand/android-icon-foreground.png',
            backgroundImage: './assets/rebrand/android-icon-background.png',
            monochromeImage: './assets/rebrand/android-icon-monochrome.png',
          }
        : config.android.adaptiveIcon,
    },
    plugins,
    extra: {
      ...config.extra,
      skipIntegrity,
      rebrand,
    },
  };
};
