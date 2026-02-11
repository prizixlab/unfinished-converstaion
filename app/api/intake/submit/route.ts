import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { detectLanguage } from '@/lib/language';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const [{ stripe }, { supabaseAdmin }] = await Promise.all([import('@/lib/stripe'), import('@/lib/supabase')]);

    const body = (await req.json()) as {
      session_id?: string;
      senderName?: string;
      recipientName?: string;
      recipientEmail?: string;
      message?: string;
    };

    if (!body.session_id || !body.senderName || !body.recipientName || !body.recipientEmail || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(body.session_id);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 402 });
    }

    const token = randomBytes(32).toString('base64url');
    const language = detectLanguage(body.message);

    const { error } = await supabaseAdmin.from('requests').insert({
      email: body.recipientEmail,
      stripe_session_id: body.session_id,
      token,
      language,
      person_role: body.recipientName,
      unfinished_summary: `From ${body.senderName}`,
      unsaid_message: body.message,
      relationship_tone: 'neutral',
      desired_outcome: 'understanding',
      status: 'pending'
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
