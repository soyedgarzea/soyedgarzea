import type { Metadata } from 'next';
import { HomePage } from '@/components/home-page';

export const metadata: Metadata = {
  title: 'Edgar Zea — Software Engineer and Zinns Founder',
  description: 'Meet Edgar Zea: software engineer, psychologist, and founder of Zinns in Mexico.',
};

export default function EnglishHome() {
  return <HomePage locale='en' />;
}
