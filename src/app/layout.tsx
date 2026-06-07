import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AdSenseAutoAds } from '@/components/AdSenseAutoAds';
import { JsonLd } from '@/components/JsonLd';
import { ADSENSE_CLIENT, SITE_NAME, SITE_PUBLISHER, SITE_URL } from '@/lib/site';
import { siteStructuredData } from '@/lib/seo/jsonLd';
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_OG_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/seo/homeMeta';
import { PRIMARY_OG_IMAGE } from '@/lib/data/imageSeo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  category: 'gardening calculator',
  creator: SITE_PUBLISHER,
  publisher: SITE_PUBLISHER,
  title: {
    default: HOME_PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_PAGE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_OG_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    images: [{ url: '/og-bedsoil.png', width: PRIMARY_OG_IMAGE.width, height: PRIMARY_OG_IMAGE.height, alt: PRIMARY_OG_IMAGE.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_OG_DESCRIPTION,
    images: [{ url: '/og-bedsoil.png', alt: PRIMARY_OG_IMAGE.alt }],
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
  ['Compare', '/best-raised-bed-soil-calculators'],
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="license" href="/rsl.xml" type="application/rsl+xml" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <JsonLd data={siteStructuredData()} />
        <AdSenseAutoAds />
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
