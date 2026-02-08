# Unfinished Conversation

A single-entry ritual product: pay once, write one message, wait, receive a private response link. Built with Next.js App Router, Supabase, Stripe, Resend, and OpenAI.

## Features
- One-time Stripe Checkout payment
- Intake flow with language detection
- Async response generation via Vercel Cron
- Private tokenized response links
- Server-side PDF download

## Local Development

```bash
npm install
npm run dev
```

Create a `.env.local` file with the values from `.env.example`.

## Supabase Setup

1. Create a new Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Store your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

> Note: For this MVP, RLS is intentionally disabled so the service role can write. If you enable RLS, add policies for the service role.

## Stripe Setup

1. Create a Stripe product and a one-time price of $27.
2. Put the price ID in `STRIPE_PRICE_ID`.
3. Add a webhook endpoint pointing to `/api/webhook/stripe`.
4. In Stripe dashboard, set:
   - Success URL: `https://your-domain.com/intake?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `https://your-domain.com/start?canceled=1`

## Resend Setup

1. Create a Resend account and verify your domain.
2. Configure SPF/DKIM/DMARC in your DNS.
3. Put the verified sender in `FROM_EMAIL` and `NEXT_PUBLIC_FROM_EMAIL`.

## OpenAI Setup

1. Create an API key.
2. Add it to `OPENAI_API_KEY`.

## Vercel Deploy + Cron

1. Deploy the repo to Vercel.
2. Add all environment variables from `.env.example`.
3. Configure a Cron job to hit:

```
GET https://your-domain.com/api/cron/generate
Authorization: Bearer <CRON_SECRET>
```

Suggested schedule: every 5 minutes.

## Security Notes
- Intake is only accessible after Stripe session is verified as paid.
- Cron endpoint is protected by `CRON_SECRET`.
- Response access is via cryptographically random token links.

