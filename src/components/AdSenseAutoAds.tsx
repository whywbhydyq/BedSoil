'use client';

import Script from 'next/script';
import { ADSENSE_CLIENT } from '@/lib/site';

export function AdSenseAutoAds() {
  if (!ADSENSE_CLIENT) return null;
  return (
    <Script
      id="adsbygoogle-auto"
      strategy="lazyOnload"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
