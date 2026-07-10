type AdPlacement = 'faq' | 'sidebar' | 'result';

const labels: Record<AdPlacement, string> = {
  faq: 'Advertisement area placed between FAQ questions',
  sidebar: 'Advertisement area in the desktop sidebar, separated from calculator controls',
  result: 'Advertisement area below the focused result summary, separated from calculator controls',
};

export function AdSlot({ placement }: { placement: AdPlacement }) {
  return (
    <div className={`ad-slot ad-${placement}`} aria-label={labels[placement]}>
      {labels[placement]}
    </div>
  );
}
