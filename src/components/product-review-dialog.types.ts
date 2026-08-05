import type { Locale } from '@/content/site.types';

export type ProductReviewDialogProps = Readonly<{
  locale: Locale;
  productName: string;
  review: string;
}>;
