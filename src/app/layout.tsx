import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ADSENSE_CLIENT, SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Raised Bed Soil Calculator - Soil Volume, Bags & Shopping List',
    template: '%s | BedSoil',
  },
  description: 'Enter raised bed length, width, depth, and bag size to estimate cubic feet, cubic yards, liters, bags, bulk cost, and a copyable shopping list.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'BedSoil',
    type: 'website',
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT,
  },
};

const nav = [
  ['Raised Bed', '/raised-bed-soil-calculator'],
  ['4×8', '/4x8-raised-bed-soil-calculator'],
  ['Bags', '/soil-bags-calculator'],
  ['Bulk vs Bags', '/bulk-soil-vs-bags-calculator'],
  ['Soil Mix', '/raised-bed-soil-mix-calculator'],
  ['Containers', '/container-soil-calculator'],
  ['Spacing', '/square-foot-garden-spacing-calculator'],
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" strategy="afterInteractive" />
        <header className="header">
          <div className="bar">
            <Link className="brand" href="/">BedSoil</Link>
            <nav className="nav" aria-label="Primary navigation">
              {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="bar nav">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
