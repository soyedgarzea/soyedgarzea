import type { Locale } from '@/content/site.types';

export type SiteHeaderProps = Readonly<{
  locale: Locale;
  languageHref: string;
}>;
