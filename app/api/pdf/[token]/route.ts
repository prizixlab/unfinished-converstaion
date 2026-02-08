import { NextResponse } from 'next/server';
import { Document, Page, StyleSheet, Text, pdf } from '@react-pdf/renderer';
import { supabaseAdmin } from '@/lib/supabase';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 16,
    marginBottom: 16
  }
});

export async function GET(_: Request, { params }: { params: { token: string } }) {
  const { data, error } = await supabaseAdmin
    .from('requests')
    .select('response_text, status')
    .eq('token', params.token)
    .maybeSingle();

  if (error || !data || data.status !== 'ready' || !data.response_text) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Unfinished Conversation</Text>
        <Text>{data.response_text}</Text>
      </Page>
    </Document>
  );

  const buffer = await pdf(doc).toBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="unfinished-conversation.pdf"'
    }
  });
}

export const dynamic = 'force-dynamic';
