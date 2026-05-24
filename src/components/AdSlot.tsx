export function AdSlot({ placement }: { placement: 'result' | 'faq' | 'sidebar' }) {
  const label = placement === 'result'
    ? 'Advertisement placeholder below the result area'
    : placement === 'faq'
      ? 'Advertisement placeholder in the FAQ middle'
      : 'Advertisement placeholder in the desktop sidebar';

  return <div className={`ad-slot ${placement === 'sidebar' ? 'ad-sidebar' : ''}`} aria-label={label}>{label}</div>;
}
