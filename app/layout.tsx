import './globals.css';
import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'Unfinished Conversation',
  description: 'A one-scenario ritual to write what was never said and receive a private response.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${lora.variable}`}>
      <body className="min-h-screen bg-background text-text">
        <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12 md:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
