//src/components/marketing/Shop/shopTypes.ts

export type ProductVM = {
  /** URL identifier: numeric id or spare-part code */
  linkId: string;
  title: string;
  image: string; // main image url or placeholder
  articleNo?: string;
  supplierName?: string;
  categoryName?: string;
};

/** Pick the first non-empty image url from an images array, or fall back to placeholder */
export const firstImage = (images?: Array<{ image_url?: string }>) =>
  images?.find((i) => !!i.image_url)?.image_url ?? '/images/placeholder.jpg';
