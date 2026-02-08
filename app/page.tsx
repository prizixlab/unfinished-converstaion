import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col justify-between gap-12">
      <div className="space-y-10">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-muted">Unfinished Conversation</p>
          <h1 className="font-[var(--font-lora)] text-4xl font-semibold leading-tight md:text-5xl">
            A single, quiet ritual for the words that never landed.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            Pay once. Write once. Wait with intention. Receive a private response that could have been heard.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <Link
            href="/start"
            className="glow-hover inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent-text transition"
          >
            Begin
          </Link>
          <div className="rounded-3xl border border-border bg-surface-2 px-6 py-4 text-sm text-muted">
            Not a chat. No account. One entry → one exit.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-sm text-muted">
        <p>Private by design. Your message is never public.</p>
        <p>Made for closure, reflection, and release.</p>
      </div>
    </div>
  );
}
