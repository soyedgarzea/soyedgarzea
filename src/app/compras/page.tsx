import type { Metadata } from 'next';
import { ItemsPage } from '@/components/items-page';

export const metadata: Metadata = {
  title: 'Cosas que he comprado | Edgar Zea',
  description: 'Productos que Edgar Zea ha comprado, probado y recomienda.',
};

export default function SpanishItemsPage() {
  return <ItemsPage locale='es' />;
}
