'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import type { SODetails } from '@/lib/zoho';

export default function DeliveryClient({ soDetails }: { soDetails: SODetails }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sigEmpty, setSigEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const pad = padRef.current;
    if (!canvas || !pad) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const saved = pad.toData();
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(ratio, ratio);
    pad.fromData(saved);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, { backgroundColor: 'rgb(255,255,255)' });
    padRef.current = pad;
    pad.addEventListener('endStroke', () => setSigEmpty(pad.isEmpty()));
    resizeCanvas();

    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      pad.off();
    };
  }, [resizeCanvas]);

  const clearSignature = () => {
    padRef.current?.clear();
    setSigEmpty(true);
  };

  const handleSubmit = async () => {
    if (!confirmed) { setError('Please tick the confirmation box first.'); return; }
    if (padRef.current?.isEmpty()) { setError('Please add your signature.'); return; }

    setError(null);
    setSubmitting(true);

    try {
      const signatureDataUrl = padRef.current!.toDataURL('image/png');
      const res = await fetch('/api/delivery/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soNumber: soDetails.soNumber,
          signatureDataUrl,
          confirmedAt: new Date().toISOString(),
          customerName: soDetails.customerName,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryDateFormatted = soDetails.deliveryDate
    ? new Date(soDetails.deliveryDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-semibold text-ink mb-2">Delivery Confirmed</h1>
          <p className="text-ink-soft text-sm leading-relaxed">
            Your acknowledgement for <span className="font-semibold text-ink">{soDetails.soNumber}</span> has been
            recorded. Thank you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-ink/5">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xl font-display font-semibold text-ink">Shy</span>
          <span className="text-xs text-ink-muted font-medium uppercase tracking-wide">Delivery Receipt</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-12">

        {/* Order summary */}
        <div className="rounded-2xl border border-ink/8 p-5">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">Sales Order</p>
          <p className="text-2xl font-display font-semibold text-ink">{soDetails.soNumber}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-ink-muted text-xs mb-0.5">Customer</p>
              <p className="font-medium text-ink">{soDetails.customerName}</p>
            </div>
            <div>
              <p className="text-ink-muted text-xs mb-0.5">Delivery Date</p>
              <p className="font-medium text-ink">{deliveryDateFormatted}</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-2xl border border-ink/8 overflow-hidden">
          <div className="px-5 py-3 border-b border-ink/5 bg-cream-50">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Items Delivered</p>
          </div>
          <ul>
            {soDetails.lineItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-5 py-3.5 border-b border-ink/5 last:border-0"
              >
                <span className="text-sm font-medium text-ink">{item.name}</span>
                <span className="text-sm text-ink-muted ml-4 shrink-0">
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 p-5 rounded-2xl border border-ink/8 cursor-pointer active:bg-cream-50 transition-colors">
          <div className="mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-5 w-5 rounded border-ink/20 accent-ink cursor-pointer"
            />
          </div>
          <span className="text-sm text-ink-soft leading-relaxed">
            I confirm that all the products listed above were delivered in good condition and match this order.
          </span>
        </label>

        {/* Signature pad */}
        <div className="rounded-2xl border border-ink/8 overflow-hidden">
          <div className="px-5 py-3 border-b border-ink/5 bg-cream-50 flex items-center justify-between">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest">Signature</p>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-ink-muted hover:text-ink underline underline-offset-2"
            >
              Clear
            </button>
          </div>
          <div className="bg-white p-1">
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ height: 160, touchAction: 'none' }}
            />
          </div>
          <p className="px-5 py-2.5 text-xs text-ink-muted bg-cream-50 border-t border-ink/5">
            Sign with your finger or stylus
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !confirmed || sigEmpty}
          className="w-full btn-primary text-base py-4 rounded-2xl disabled:opacity-40"
        >
          {submitting ? 'Submitting…' : 'Confirm & Sign Delivery'}
        </button>

        <p className="text-center text-xs text-ink-muted">
          By signing you confirm receipt of the goods above. This acknowledgement will be recorded against {soDetails.soNumber}.
        </p>
      </main>
    </div>
  );
}
