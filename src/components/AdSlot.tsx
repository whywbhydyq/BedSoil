export function AdSlot({ placement }: { placement: 'faq' | 'sidebar' }) {
  const label = placement === 'faq'
    ? 'Advertisement area placed between FAQ questions'
    : 'Advertisement area in the desktop sidebar, separated from calculator controls';

  return <div className={`ad-slot ${placement === 'sidebar' ? 'ad-sidebar' : ''}`} aria-label={label}>{label}</div>;
}
