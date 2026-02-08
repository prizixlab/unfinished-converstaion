import { CheckoutButton } from '@/components/CheckoutButton';

export default function StartPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Begin</p>
        <h1 className="font-[var(--font-lora)] text-3xl font-semibold md:text-4xl">
          A simple three-step ritual.
        </h1>
        <ul className="space-y-3 text-muted">
          <li>1. Pay $27 for a single private conversation.</li>
          <li>2. Write one message to the person you can’t reach.</li>
          <li>3. Wait. We’ll email a private link to your response.</li>
        </ul>
      </div>
      <div className="rounded-3xl border border-border bg-surface px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-muted">One conversation</p>
            <p className="text-3xl font-semibold">$27</p>
          </div>
          <CheckoutButton />
        </div>
      </div>
      <p className="text-sm text-muted">
        After payment, you’ll be guided to write your message. We’ll respond in the same language you use.
      </p>
    </div>
  );
}
