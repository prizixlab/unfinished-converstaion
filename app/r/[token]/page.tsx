import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export default async function ResultPage({ params }: { params: { token: string } }) {
  const { data, error } = await supabaseAdmin
    .from('requests')
    .select('response_text, status')
    .eq('token', params.token)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  if (data.status !== 'ready' || !data.response_text) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Not ready yet</h1>
        <p className="text-muted">Your response is still being prepared. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Your response</p>
        <h1 className="font-[var(--font-lora)] text-3xl font-semibold">Read when you feel ready.</h1>
      </div>
      <div className="whitespace-pre-wrap rounded-3xl border border-border bg-surface px-6 py-6 text-sm leading-7 text-text">
        {data.response_text}
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <a
          href={`/api/pdf/${params.token}`}
          className="glow-hover inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent transition"
        >
          Download PDF
        </a>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted transition hover:text-text"
        >
          Close
        </Link>
      </div>
    </div>
  );
}
