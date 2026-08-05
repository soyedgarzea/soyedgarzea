import { socialLinks } from '@/content/site.data';
import type { SiteFooterProps } from './site-footer.types';

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className='site-footer'>
      <p>
        {locale === 'es'
          ? 'Construido con curiosidad desde México.'
          : 'Built with curiosity from Mexico.'}
      </p>
      <div className='social-list'>
        {socialLinks.map(social => (
          <a
            href={social.href}
            key={social.label}
            rel='noreferrer'
            target='_blank'
          >
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
