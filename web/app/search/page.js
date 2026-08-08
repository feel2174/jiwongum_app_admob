import { redirect } from 'next/navigation';

// 검색은 이제 랜딩(/)에 있다. 기존 /search 링크·앱 탭 유입은 홈으로 보낸다.
export default function SearchPage() {
  redirect('/');
}
