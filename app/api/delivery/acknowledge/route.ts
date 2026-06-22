import { NextRequest, NextResponse } from 'next/server';
import { getSalesOrderByNumber, addSOComment, updateSODeliveryStatus } from '@/lib/zoho';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = 'delivery-signatures';

export async function POST(req: NextRequest) {
  try {
    const { soNumber, signatureDataUrl, confirmedAt, customerName } = await req.json() as {
      soNumber: string;
      signatureDataUrl: string;
      confirmedAt: string;
      customerName: string;
    };

    if (!soNumber || !signatureDataUrl || !confirmedAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save signature to Supabase Storage
    const base64 = signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const fileKey = `${soNumber}/${confirmedAt.replace(/[:.]/g, '-')}.png`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileKey, buffer, { contentType: 'image/png', upsert: true });

    if (uploadError) {
      // Log but don't abort — the Zoho note is the critical piece
      console.error('[acknowledge] Supabase upload failed:', uploadError.message);
    }

    // Resolve SO ID
    const so = await getSalesOrderByNumber(soNumber);
    if (!so) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }

    const confirmedDateIST = new Date(confirmedAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const name = customerName || so.customerName;

    // Add comment to SO (critical)
    await addSOComment(
      so.soId,
      `Delivery acknowledged by ${name} on ${confirmedDateIST} IST. Signature on file: ${fileKey}`
    );

    // Update custom field (best-effort — requires field to exist in Zoho Books)
    try {
      await updateSODeliveryStatus(so.soId, 'Confirmed');
    } catch (cfErr) {
      console.warn('[acknowledge] Custom field update failed (field may not exist yet):', cfErr);
    }

    return NextResponse.json({ success: true, fileKey });
  } catch (err) {
    console.error('[POST /api/delivery/acknowledge]', err);
    return NextResponse.json({ error: 'Failed to process acknowledgement' }, { status: 500 });
  }
}
