import { redirect } from 'next/navigation';

// 커뮤니티는 제거되었다(재방문율 저하 우려). 기존 경로/앱 탭 유입은 검색으로 보낸다.
// 궁금한 점은 홈의 카카오 채널/오픈채팅 버튼으로 안내.
export default function CommunityPage() {
  redirect('/search');
}
