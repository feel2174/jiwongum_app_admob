import AskSection from '../AskSection';

export const metadata = {
  title: '문의',
  description: '카카오톡 채널·오픈채팅으로 지원금 살펴줌에 궁금한 점을 물어보세요.',
};

// 두 번째 탭 전용 화면. 랜딩에 있던 '궁금한 점 물어보기' 문의 섹션을 이 화면으로 옮겼다.
// 앱(웹뷰)에서는 '선발대' 문의, 일반 웹에서는 '궁금한 점 물어보기'로 표시(AskSection이 분기).
export default function HelpPage() {
  return (
    <main className="landingMain">
      <header className="landingBrand">
        <p className="brandKicker">지원금 살펴줌</p>
      </header>

      <AskSection />
    </main>
  );
}
