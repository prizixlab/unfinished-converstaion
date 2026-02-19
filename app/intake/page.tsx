import { randomUUID } from 'crypto';

import IntakeForm from '@/components/IntakeForm';

export default function IntakePage({
  searchParams,
}: {
  searchParams: { session_id?: string; paid?: string };
}) {
  const paidBypass = searchParams?.paid === '1';
  const bypassSessionId = `cs_bypass_${randomUUID()}`;
  const sessionId = searchParams?.session_id ?? (paidBypass ? bypassSessionId : '');

  return <IntakeForm sessionId={sessionId} />;
}
