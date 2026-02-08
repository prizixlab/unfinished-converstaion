import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!priceId || !siteUrl) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/intake?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/start?canceled=1`,
    customer_creation: 'if_required',
    allow_promotion_codes: false
  });

  return NextResponse.json({ url: session.url });
}
