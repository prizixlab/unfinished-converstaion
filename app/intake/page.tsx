import { IntakeForm } from '@/components/IntakeForm';
import { stripe } from '@/lib/stripe';

export default async function IntakePage({
  searchParams
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Payment required</h1>
        <p className="text-muted">We could not verify your payment session. Please return to start.</p>
      </div>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Payment pending</h1>
          <p className="text-muted">We can only accept your message after payment completes.</p>
        </div>
      );
    }
  } catch (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Session not found</h1>
        <p className="text-muted">We could not verify the session. Please return to start.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Your message</p>
        <h1 className="font-[var(--font-lora)] text-3xl font-semibold md:text-4xl">
          Write what was never said.
        </h1>
        <p className="text-muted">
          This is a single, complete entry. There will be no continuation or back-and-forth.
        </p>
      </div>
      <IntakeForm sessionId={sessionId} />
    </div>
  );
}
