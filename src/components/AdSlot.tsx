'use client';

import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT, ADSENSE_SLOTS } from '@/lib/site';

type Placement = 'result' | 'sidebar' | 'faq';

const labels: Record<Placement, string> = {
  result: 'Result area ad',
  sidebar: 'Sidebar ad',
  faq: 'FAQ ad',
};

function slotForPlacement(placement: Placement): string {
  return ADSENSE_SLOTS[placement];
}

export function AdSlot({ placement }: { placement: Placement }) {
  const slot = slotForPlacement(placement);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!slot || !ADSENSE_CLIENT) return;
    const target = containerRef.current;
    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      const timer = setTimeout(() => setShouldLoad(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [slot]);

  useEffect(() => {
    if (!slot || !ADSENSE_CLIENT || !shouldLoad) return;
    try {
      const adsWindow = window as typeof window & { adsbygoogle?: unknown[] };
      adsWindow.adsbygoogle = adsWindow.adsbygoogle ?? [];
      adsWindow.adsbygoogle.push({});
    } catch {
      // Ad blockers or consent tooling can block the Google ads runtime.
    }
  }, [slot, shouldLoad]);

  if (!slot || !ADSENSE_CLIENT || !shouldLoad) {
    return (
      <div ref={containerRef} className={`ad-slot ad-${placement}`} aria-label={labels[placement]}>
        {labels[placement]}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="ad-loader-shell">
      <ins
        className={`adsbygoogle ad-slot ad-${placement}`}
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label={labels[placement]}
      />
    </div>
  );
}
