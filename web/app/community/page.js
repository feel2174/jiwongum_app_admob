import FontControls from '../FontControls';
import CommunityBoard from '../CommunityBoard';
import { seniorArticles } from '../seniorArticles';

export const metadata = {
  title: '선발대',
  description: '시니어 혜택을 먼저 확인한 사람들의 질문과 경험을 가볍게 남겨보는 공간입니다.',
};

export default function CommunityPage() {
  return (
    <main>
      <header className="communityHero">
        <div className="communityHeroInner">
          <p className="eyebrow">선발대</p>
          <h1>먼저 확인한 사람들의 질문과 경험</h1>
          <p className="heroCopy">
            연금, 돌봄, 일자리, 생활비 지원을 살펴보다 막히는 부분을 남겨보세요.
            지금은 가볍게 시험 운영하는 공간입니다.
          </p>
        </div>
      </header>

      <CommunityBoard policies={seniorArticles} />
      <FontControls />
    </main>
  );
}
