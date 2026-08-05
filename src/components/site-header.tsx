import Link from 'next/link';
import { navigation } from '@/content/site.data';
import type { SiteHeaderProps } from './site-header.types';

export function SiteHeader({ languageHref, locale }: SiteHeaderProps) {
  const languageLabel = locale === 'es' ? 'EN' : 'ES';

  return (
    <header className='site-header'>
      <Link
        className='wordmark'
        href={locale === 'es' ? '/' : '/en'}
      >
        Edgar<span>.</span>
      </Link>
      <nav
        aria-label={locale === 'es' ? 'Navegación principal' : 'Main navigation'}
        className='main-navigation'
      >
        {navigation[locale].map(item => (
          <Link
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        className='language-link'
        href={languageHref}
      >
        {languageLabel}
      </Link>
    </header>
  );
}
