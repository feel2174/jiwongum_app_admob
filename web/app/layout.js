import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://senior.zucca100.com'),
  title: {
    default: '시니어 서포트',
    template: '%s | 시니어 서포트',
  },
  description: '기초연금, 의료비, 주거, 노인일자리, 난방비까지 — 단어 하나로 시니어 지원금을 바로 찾는 시니어 서포트(Senior Support).',
  openGraph: {
    title: '시니어 서포트',
    description: '단어 하나만 입력하면 관련 지원금을 바로 찾아드립니다. 시니어 서포트(Senior Support).',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9196149361612087';

  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="naver-site-verification" content="8bd2fc666424fe37884a593e1a2991a5c778c9bd" />
        {adsenseClient ? (
          <>
            {/*
              광고 안전(요구사항 E): 시니어 오탭 방지.
              - 앵커(하단 고정) 오버레이는 아래 page-level 설정으로 끈다(네이티브 탭바 위 오탭 원인 제거).
              - ⚠️ 비녜트(전면/인터스티셜, 화면 전환 직후 노출)는 페이지 코드로 완전 제어가 불가하므로,
                반드시 AdSense 계정 > 광고 > 자동 광고 설정에서 'Vignette(전면)'와 'Anchor(앵커)'를 OFF로 둘 것.
                (계정 토글이 최종 안전장치. 아래 코드는 앵커에 대한 보조 억제.)
            */}
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
              crossOrigin="anonymous"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `(adsbygoogle=window.adsbygoogle||[]).push({google_ad_client:"${adsenseClient}",enable_page_level_ads:true,overlays:{bottom:false}});`,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
