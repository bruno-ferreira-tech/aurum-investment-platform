import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#d4af37',
};

export const metadata: Metadata = {
  title: 'Aurum - Premium Investment Platform',
  description:
    'Invest smarter with Aurum. Access institutional-grade portfolios, real-time market data, and AI-powered insights. Start your wealth journey today.',
  keywords: ['investment', 'portfolio', 'finance', 'wealth management', 'stocks', 'crypto'],
  openGraph: {
    title: 'Aurum - Premium Investment Platform',
    description: 'Invest smarter with Aurum. Institutional-grade portfolios for everyone.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurum - Premium Investment Platform',
    description: 'Invest smarter with Aurum.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-dark-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
