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
      <CommunityBoard policies={seniorArticles} />
      <FontControls />
    </main>
  );
}
