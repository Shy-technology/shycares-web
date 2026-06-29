import { NextRequest, NextResponse } from 'next/server';
import { getSalesOrderByNumber, addSOComment, updateSODeliveryStatus } from '@/lib/zoho';
import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = 'delivery-signatures';

async function generatePODPdf(params: {
  soNumber: string;
  customerName: string;
  confirmedAt: string;
  lineItems: { name: string; quantity: number; unit: string }[];
  signatureDataUrl: string;
  referenceId: string;
}): Promise<Uint8Array> {
  const { soNumber, customerName, confirmedAt, lineItems, signatureDataUrl, referenceId } = params;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin = 50;
  const contentWidth = width - margin * 2;
  const inkDark = rgb(0.1, 0.1, 0.1);
  const inkMid = rgb(0.4, 0.4, 0.4);
  const inkLight = rgb(0.7, 0.7, 0.7);
  const brandBlue = rgb(0.12, 0.31, 0.49);

  let y = height - margin;

  // Header bar
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: brandBlue });
  page.drawText('SHY', { x: margin, y: height - 45, size: 28, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Proof of Delivery', { x: margin, y: height - 62, size: 10, font: fontRegular, color: rgb(0.8, 0.9, 1) });
  page.drawText('Prescom Technologies Private Limited', { x: width - margin - 220, y: height - 40, size: 9, font: fontRegular, color: rgb(0.8, 0.9, 1) });
  page.drawText('shycares.in', { x: width - margin - 220, y: height - 55, size: 9, font: fontRegular, color: rgb(0.7, 0.85, 1) });

  y = height - 95;

  // Reference ID
  page.drawText(`Reference: ${referenceId}`, { x: margin, y, size: 8, font: fontRegular, color: inkLight });
  y -= 20;

  // Order details box
  const boxH = 70;
  page.drawRectangle({
    x: margin, y: y - boxH, width: contentWidth, height: boxH,
    color: rgb(0.96, 0.97, 0.99), borderColor: rgb(0.85, 0.88, 0.92), borderWidth: 1,
  });

  const col1 = margin + 16;
  const col2 = margin + contentWidth / 2;
  const rowTop = y - 18;

  page.drawText('Sales Order', { x: col1, y: rowTop, size: 8, font: fontRegular, color: inkMid });
  page.drawText(soNumber, { x: col1, y: rowTop - 14, size: 13, font: fontBold, color: inkDark });
  page.drawText('Customer', { x: col2, y: rowTop, size: 8, font: fontRegular, color: inkMid });
  page.drawText(customerName, { x: col2, y: rowTop - 14, size: 11, font: fontBold, color: inkDark });

  const confirmedDateIST = new Date(confirmedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  page.drawText('Acknowledged On', { x: col1, y: rowTop - 36, size: 8, font: fontRegular, color: inkMid });
  page.drawText(`${confirmedDateIST} IST`, { x: col1, y: rowTop - 50, size: 9, font: fontRegular, color: inkDark });

  y -= boxH + 20;

  // Line items table
  page.drawText('ITEMS DELIVERED', { x: margin, y, size: 8, font: fontBold, color: inkMid });
  y -= 12;

  // Table header
  page.drawRectangle({ x: margin, y: y - 20, width: contentWidth, height: 20, color: brandBlue });
  page.drawText('Item', { x: margin + 8, y: y - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Qty', { x: margin + contentWidth - 80, y: y - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Unit', { x: margin + contentWidth - 40, y: y - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  y -= 20;

  // Table rows
  lineItems.forEach((item, i) => {
    const rowColor = i % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.98);
    page.drawRectangle({ x: margin, y: y - 18, width: contentWidth, height: 18, color: rowColor });
    const maxNameLen = 55;
    const itemName = item.name.length > maxNameLen ? item.name.substring(0, maxNameLen) + '…' : item.name;
    page.drawText(itemName, { x: margin + 8, y: y - 12, size: 8, font: fontRegular, color: inkDark });
    page.drawText(String(item.quantity), { x: margin + contentWidth - 80, y: y - 12, size: 8, font: fontRegular, color: inkDark });
    page.drawText(item.unit || 'pcs', { x: margin + contentWidth - 40, y: y - 12, size: 8, font: fontRegular, color: inkDark });
    y -= 18;
  });

  page.drawRectangle({
    x: margin, y, width: contentWidth,
    height: (lineItems.length + 1) * 18 + 20,
    borderColor: rgb(0.85, 0.88, 0.92), borderWidth: 1,
  });

  y -= 24;

  // Confirmation statement
  page.drawRectangle({
    x: margin, y: y - 36, width: contentWidth, height: 36,
    color: rgb(0.94, 0.97, 0.94), borderColor: rgb(0.7, 0.88, 0.7), borderWidth: 1,
  });
  page.drawText('CUSTOMER CONFIRMATION', { x: margin + 12, y: y - 12, size: 7, font: fontBold, color: rgb(0.2, 0.5, 0.2) });
  page.drawText(
    'I confirm that I have received all items listed above in proper condition and am satisfied with the delivery.',
    { x: margin + 12, y: y - 24, size: 8, font: fontRegular, color: inkDark, maxWidth: contentWidth - 24 }
  );
  y -= 52;

  // Signature section
  page.drawText('CUSTOMER SIGNATURE', { x: margin, y, size: 8, font: fontBold, color: inkMid });
  y -= 12;

  // Signature box
  page.drawRectangle({
    x: margin, y: y - 100, width: 250, height: 100,
    color: rgb(1, 1, 1), borderColor: rgb(0.85, 0.88, 0.92), borderWidth: 1,
  });

  // Embed signature image
  try {
    const sigBase64 = signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const sigBytes = Buffer.from(sigBase64, 'base64');
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigDims = sigImage.scaleToFit(240, 90);
    page.drawImage(sigImage, {
      x: margin + (250 - sigDims.width) / 2,
      y: y - 96 + (90 - sigDims.height) / 2,
      width: sigDims.width,
      height: sigDims.height,
    });
  } catch {
    page.drawText('(signature image unavailable)', {
      x: margin + 20, y: y - 55, size: 8, font: fontRegular, color: inkLight,
    });
  }

  // Signature details
  const sigRight = margin + 270;
  page.drawText('Signed by', { x: sigRight, y, size: 8, font: fontRegular, color: inkMid });
  page.drawText(customerName, { x: sigRight, y: y - 14, size: 10, font: fontBold, color: inkDark });
  page.drawText('Date & Time', { x: sigRight, y: y - 36, size: 8, font: fontRegular, color: inkMid });
  page.drawText(`${confirmedDateIST} IST`, { x: sigRight, y: y - 50, size: 9, font: fontRegular, color: inkDark });
  page.drawText('Method', { x: sigRight, y: y - 72, size: 8, font: fontRegular, color: inkMid });
  page.drawText('Web acknowledgement via shycares.in', { x: sigRight, y: y - 84, size: 8, font: fontRegular, color: inkDark });

  y -= 116;

  // Footer
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: inkLight });
  y -= 14;
  page.drawText(
    `This document is an electronically generated Proof of Delivery for Sales Order ${soNumber}. Reference: ${referenceId}`,
    { x: margin, y, size: 7, font: fontRegular, color: inkLight, maxWidth: contentWidth }
  );
  page.drawText(
    'Generated by Shy (Prescom Technologies Pvt Ltd) · shycares.in · GSTIN: 29AAMCP3475F1Z0',
    { x: margin, y: y - 12, size: 7, font: fontRegular, color: inkLight }
  );

  return pdfDoc.save();
}

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

    const so = await getSalesOrderByNumber(soNumber);
    if (!so) {
      return NextResponse.json({ error: 'Sales order not found' }, { status: 404 });
    }

    const name = customerName || so.customerName;
    const referenceId = `POD-${soNumber}-${Date.now()}`;
    const timestamp = confirmedAt.replace(/[:.]/g, '-');
    const pdfKey = `${soNumber}/${timestamp}.pdf`;

    // Generate POD PDF
    const pdfBytes = await generatePODPdf({
      soNumber,
      customerName: name,
      confirmedAt,
      lineItems: so.lineItems,
      signatureDataUrl,
      referenceId,
    });

    // Upload PDF to Supabase
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(pdfKey, pdfBytes, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      console.error('[acknowledge] Supabase PDF upload failed:', uploadError.message);
    }

    //
