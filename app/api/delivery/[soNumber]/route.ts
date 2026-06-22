import { NextRequest, NextResponse } from 'next/server';
import { getSalesOrderByNumber } from '@/lib/zoho';

export async function GET(
  _req: NextRequest,
  { params }: { params: { soNumber: string } }
) {
  try {
    const so = await getSalesOrderByNumber(params.soNumber);
    if (!so) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }
    return NextResponse.json(so);
  } catch (err) {
    console.error('[GET /api/delivery]', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
