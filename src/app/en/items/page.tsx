import type { Metadata } from 'next';
import { ItemsPage } from '@/components/items-page';

export const metadata: Metadata = {
  title: 'Things I have bought | Edgar Zea',
  description: 'Products Edgar Zea has bought, tried, and recommends.',
};

export default function EnglishItemsPage() {
  return <ItemsPage locale='en' />;
}
