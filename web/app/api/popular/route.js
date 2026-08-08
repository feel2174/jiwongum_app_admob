import { NextResponse } from 'next/server';
import { getPopularServices } from '../../lib/gov24';

// GET /api/popular — 시니어 인기 지원금 5건. 검색 0건/폴백 노출용.
export async function GET() {
  try {
    const results = await getPopularServices(5);
    return NextResponse.json(
      { count: results.length, results },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch (err) {
    console.error('popular route failed:', err.message);
    return NextResponse.json({ count: 0, results: [] }, { status: 502 });
  }
}
