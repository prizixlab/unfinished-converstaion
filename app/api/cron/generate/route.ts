import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateResponse } from '@/lib/openai';
import { resend } from '@/lib/resend';

const delayDefault = Number(process.env.DELAY_MINUTES_DEFAULT ?? '180');

function buildPrompt(request: {
  person_role: string | null;
  unfinished_summary: string | null;
  unsaid_message: string | null;
  relationship_tone: string | null;
  desired_outcome: string | null;
  language: string | null;
}) {
  return `You are writing a single response that could have been heard. This is not a chat. It is a one-time, complete response.

Content rules:
- Do NOT claim real communication with the dead or any supernatural guarantee.
- Do NOT invent new factual memories or details about the person.
- Avoid clichés and overly-sappy lines unless the tone strongly calls for it.
- Tone: calm, adult, restrained, non-urgent.
- Support closure and reflection, not dependency.
- Do not encourage repeated use or “come back daily”.
- Output length: 500–900 words.
- Write in the same language as the user's input.

Context:
Person role: ${request.person_role ?? ''}
What feels unfinished: ${request.unfinished_summary ?? ''}
What they didn’t say:
${request.unsaid_message ?? ''}
Relationship tone: ${request.relationship_tone ?? ''}
Desired outcome: ${request.desired_outcome ?? ''}
Detected language: ${request.language ?? 'unknown'}

Write the response now.`;
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('requests')
    .select(
      'id, email, token, created_at, delay_minutes, person_role, unfinished_summary, unsaid_message, relationship_tone, desired_outcome, language'
    )
    .eq('status', 'pending');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const fromEmail = process.env.FROM_EMAIL ?? '';

  for (const request of data ?? []) {
    const delayMinutes = request.delay_minutes ?? delayDefault;
    const createdAt = new Date(request.created_at).getTime();
    if (Number.isNaN(createdAt)) continue;
    if (now - createdAt < delayMinutes * 60 * 1000) continue;

    try {
      const prompt = buildPrompt(request);
      const responseText = await generateResponse(prompt);
      const readyAt = new Date().toISOString();

      await supabaseAdmin
        .from('requests')
        .update({ status: 'ready', response_text: responseText, ready_at: readyAt })
        .eq('id', request.id);

      const link = `${siteUrl}/r/${request.token}`;
      if (request.email) {
        await resend.emails.send({
          from: fromEmail,
          to: request.email,
          subject: 'Your text is ready',
          text: `Your text is ready. Open it when you feel ready: ${link}\n\nIf you don’t see this email, check spam/promotions.`
        });
      }
    } catch (err) {
      await supabaseAdmin
        .from('requests')
        .update({ status: 'failed', error: err instanceof Error ? err.message : 'Unknown error' })
        .eq('id', request.id);
    }
  }

  return NextResponse.json({ ok: true, processed: data?.length ?? 0 });
}

export const dynamic = 'force-dynamic';
