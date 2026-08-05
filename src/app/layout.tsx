import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import type { RootLayoutProps } from './layout.types';

export const metadata: Metadata = {
  metadataBase: new URL('https://soyedgarzea.vercel.app'),
  title: 'Edgar Zea — Ingeniero de software y fundador de Zinns',
  description:
    'Conoce a Edgar Zea: ingeniero de software, psicólogo y fundador de Zinns en México.',
  openGraph: {
    title: 'Edgar Zea',
    description: 'Software, psicología, curiosidad y productos digitales desde México.',
    type: 'website',
    locale: 'es_MX',
    alternateLocale: 'en_US',
    url: 'https://soyedgarzea.vercel.app',
  },
  alternates: {
    canonical: '/',
    languages: {
      es: '/',
      en: '/en',
    },
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang='es'
      className='h-full antialiased'
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
