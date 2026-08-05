import type { Metadata } from 'next';
import './globals.css';
import type { RootLayoutProps } from './layout.types';

export const metadata: Metadata = {
  title: 'Edgar Zea — Ingeniero de software y fundador de Zinns',
  description:
    'Conoce a Edgar Zea: ingeniero de software, psicólogo y fundador de Zinns en México.',
  openGraph: {
    title: 'Edgar Zea',
    description: 'Software, psicología, curiosidad y productos digitales desde México.',
    type: 'website',
    locale: 'es_MX',
    alternateLocale: 'en_US',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang='es'
      className='h-full antialiased'
    >
      <body>{children}</body>
    </html>
  );
}
