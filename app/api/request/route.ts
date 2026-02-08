import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { detectLanguage } from '@/lib/language';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      sessionId?: string;
      email?: string;
      personRole?: string;
      unfinishedSummary?: string;
      unsaidMessage?: string;
      relationshipTone?: string;
      desiredOutcome?: string;
    };

    if (!body.sessionId || !body.email || !body.unsaidMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(body.sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not verified' }, { status: 403 });
    }

    const token = randomBytes(32).toString('base64url');
    const language = detectLanguage(body.unsaidMessage);

    const { error } = await supabaseAdmin.from('requests').insert({
      email: body.email,
      stripe_session_id: body.sessionId,
      token,
      language,
      person_role: body.personRole,
      unfinished_summary: body.unfinishedSummary,
      unsaid_message: body.unsaidMessage,
      relationship_tone: body.relationshipTone,
      desired_outcome: body.desiredOutcome,
      status: 'pending'
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
