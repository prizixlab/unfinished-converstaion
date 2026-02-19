import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      sessionId?: string;
      name?: string;
      recipient?: string;
      message?: string;
      email?: string;
    };

    const { sessionId, name, recipient, message, email } = body;
    const isBypassSession = Boolean(sessionId?.startsWith('cs_bypass_'));

    console.log('INTAKE SUBMIT PAYLOAD:', {
      sessionId,
      name,
      recipient,
      message,
      email,
      bypassMode: isBypassSession,
    });

    if (!sessionId || !name || !message || !email) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'sessionId, name, message, and email are required.',
        },
        { status: 400 }
      );
    }

    if (!isBypassSession) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (checkoutSession.payment_status !== 'paid') {
        return NextResponse.json(
          {
            error: 'Payment not verified',
            details: {
              payment_status: checkoutSession.payment_status,
              status: checkoutSession.status,
            },
          },
          { status: 403 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from('intake_messages')
      .insert({
        stripe_session_id: sessionId,
        name,
        recipient,
        message,
        email,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to insert intake message',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Server error',
        details: error?.message ?? 'Unexpected error while submitting intake message.',
      },
      { status: 500 }
    );
  }
}
