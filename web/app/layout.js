import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://senior.zucca100.com'),
  title: {
    default: '시니어 지원금 모아보기',
    template: '%s | 시니어 지원금 모아보기',
  },
  description: '기초연금, 노령연금, 국민연금, 사학연금, 노인일자리, 건강보험 피부양자 등록까지 시니어에게 필요한 글을 한 페이지에 모았습니다.',
  openGraph: {
    title: '시니어 지원금 모아보기',
    description: '앱에 등록된 시니어 대상 글만 골라 보기 쉽게 정리한 안내 페이지입니다.',
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
        {adsenseClient ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
