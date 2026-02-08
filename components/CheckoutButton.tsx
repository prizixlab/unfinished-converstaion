'use client';

import { useState } from 'react';

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/checkout', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Unable to start checkout');
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err) {
      setError('We could not start checkout. Please refresh and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="glow-hover inline-flex items-center justify-center rounded-full border border-accent bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-text transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Redirecting…' : 'Continue to payment'}
      </button>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
