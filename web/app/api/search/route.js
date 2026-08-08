import { NextResponse } from 'next/server';
import { searchServices } from '../../lib/gov24';

// GET /api/search?q=난방&region=서울특별시
// 서버측에서 gov24 인덱스를 검색해 JSON으로 반환. GOV_API_KEY는 서버에만 존재.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim().slice(0, 40);
  const region = (searchParams.get('region') || '').trim().slice(0, 20);

  if (!q) {
    return NextResponse.json({ query: '', count: 0, results: [] });
  }

  try {
    const results = await searchServices(q, { region, limit: 40 });
    return NextResponse.json(
      { query: q, region, count: results.length, results },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
    );
  } catch (err) {
    console.error('search route failed:', err.message);
    return NextResponse.json(
      { query: q, count: 0, results: [], error: 'SEARCH_FAILED' },
      { status: 502 },
    );
  }
}
