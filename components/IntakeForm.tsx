'use client';

import { useMemo, useState } from 'react';
import { franc } from 'franc-min';
import langs from 'langs';

const tones = ['warm', 'neutral', 'tense', 'grieving', 'conflicted'] as const;
const outcomes = ['goodbye', 'forgiveness', 'understanding', 'letting go'] as const;

type IntakeData = {
  email: string;
  personRole: string;
  unfinishedSummary: string;
  unsaidMessage: string;
  relationshipTone: (typeof tones)[number];
  desiredOutcome: (typeof outcomes)[number];
};

function labelForLanguage(code: string) {
  if (code === 'und') return 'Unknown';
  const language = langs.where('3', code);
  return language?.name ?? 'Unknown';
}

export function IntakeForm({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<IntakeData>({
    email: '',
    personRole: '',
    unfinishedSummary: '',
    unsaidMessage: '',
    relationshipTone: 'neutral',
    desiredOutcome: 'understanding'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectedLang = useMemo(() => {
    if (!data.unsaidMessage.trim()) return null;
    const langCode = franc(data.unsaidMessage, { minLength: 12 });
    return labelForLanguage(langCode);
  }, [data.unsaidMessage]);

  const handleChange = (field: keyof IntakeData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sessionId })
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Unable to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError('We could not save your request. Please refresh and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-4 rounded-3xl border border-border bg-surface px-6 py-6">
        <h2 className="text-2xl font-semibold">Your response is underway.</h2>
        <p className="text-muted">
          Your reply will be prepared over the next few hours. When it’s ready, we’ll email you a private
          link to view it.
        </p>
        <p className="text-muted">
          If you don’t see the email, please check spam/promotions. You may also add{' '}
          <span className="text-text">{process.env.NEXT_PUBLIC_FROM_EMAIL ?? 'our sender email'}</span>{' '}
          to your contacts.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-muted">Email</label>
        <input
          required
          type="email"
          value={data.email}
          onChange={handleChange('email')}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="you@example.com"
        />
        <p className="text-xs text-muted">Used only to send your private link.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Who is this person to you?</label>
        <input
          required
          type="text"
          value={data.personRole}
          onChange={handleChange('personRole')}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Friend, parent, partner…"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">What feels unfinished?</label>
        <input
          required
          type="text"
          value={data.unfinishedSummary}
          onChange={handleChange('unfinishedSummary')}
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="The last call, the apology, the silence…"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted">Write in any language. We’ll respond in the same language.</label>
        <textarea
          required
          value={data.unsaidMessage}
          onChange={handleChange('unsaidMessage')}
          rows={10}
          className="textarea-glow w-full resize-none rounded-2xl border border-border bg-surface-2 px-4 py-4 text-sm text-text focus:outline-none"
          placeholder="Type here — any language is welcome."
        />
        {data.unsaidMessage.trim() ? (
          <p className="text-xs text-muted">Detected: {detectedLang ?? 'Unknown'}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-muted">Relationship tone</label>
          <select
            value={data.relationshipTone}
            onChange={handleChange('relationshipTone')}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted">Desired outcome</label>
          <select
            value={data.desiredOutcome}
            onChange={handleChange('desiredOutcome')}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {outcomes.map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="glow-persistent inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-text transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit for response'}
      </button>
    </form>
  );
}
