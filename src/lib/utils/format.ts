export function fmt(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  return (Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  });
}

export function plantText(value: number | [number, number]): string {
  return Array.isArray(value) ? `${value[0]}–${value[1]}` : `${value}`;
}

export function slugToTitle(slug: string): string {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
