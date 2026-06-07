const fallbackSiteUrl = 'https://bedsoil.ymirtool.com';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl).replace(/\/$/, '');
export const SITE_NAME = 'BedSoil';
export const SITE_PUBLISHER = 'YmirTool';
export const SITE_CONTACT_EMAIL = 'ymirtool@ymirtool.com';
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-1653188471819736';
export const ADS_TXT_LINE = 'google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0';

export const ADSENSE_SLOTS = {
  result: process.env.NEXT_PUBLIC_ADSENSE_RESULT_SLOT ?? '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ?? '',
  faq: process.env.NEXT_PUBLIC_ADSENSE_FAQ_SLOT ?? '',
} as const;
