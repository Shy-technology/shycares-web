import { notFound } from 'next/navigation';
import { getSalesOrderByNumber } from '@/lib/zoho';
import DeliveryClient from './DeliveryClient';

export const dynamic = 'force-dynamic';

export default async function DeliveryPage({
  params,
}: {
  params: { soNumber: string };
}) {
  let so;
  try {
    so = await getSalesOrderByNumber(params.soNumber);
  } catch (err) {
    console.error('[DeliveryPage] Zoho fetch failed:', err);
    so = null;
  }

  if (!so) notFound();

  return <DeliveryClient soDetails={so} />;
}
