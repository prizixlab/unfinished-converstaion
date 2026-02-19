'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function IntakeForm({ sessionId }: { sessionId: string }) {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ok) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: senderName,
          recipient: recipientName,
          message,
          email: recipientEmail,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to submit.');

      setOk(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const isLocked = loading || ok;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-white">
      <div className="mb-10">
        <Link
          href="/start"
          className="text-sm uppercase tracking-[0.28em] text-white/70 hover:text-white"
        >
          Verba Non Dicta
        </Link>
      </div>

      <h1 className="text-3xl font-semibold">Write your message</h1>
      <p className="mt-3 text-base text-white/70">
        Your space is open. Write when you’re ready.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm text-white/80">Your name</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 disabled:opacity-60"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            disabled={isLocked}
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/80">This message is for</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 disabled:opacity-60"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="A person / Someone I miss / Someone important"
            disabled={isLocked}
          />
        </div>

        <div>
          <label className="text-sm text-white/80">Your message</label>
          <textarea
            className="mt-1 min-h-[180px] w-full rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 disabled:opacity-60"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLocked}
            required
          />
        </div>

        <div>
          <label className="text-sm text-white/80">
            Your email (where the reply will arrive)
          </label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 outline-none ring-1 ring-white/15 focus:ring-2 disabled:opacity-60"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            disabled={isLocked}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLocked}
          className="glow-hover inline-flex w-full items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent-text disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send your message'}
        </button>

        {ok ? (
          <p className="text-sm text-green-300">✅ Your words are sent. Wait for the reply.</p>
        ) : null}
        {error ? <p className="text-sm text-red-300">❌ {error}</p> : null}
      </form>
    </main>
  );
}
