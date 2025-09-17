//src/components/marketing/Shop/shopTypes.ts
export type ProductVM = {
    /** what we put in the URL: usually numeric id (code) */
    linkId: string;
    title: string;
    price: number;
    reviews: number; // API doesn’t supply; keep your UI happy
    image: string;   // main image url or placeholder
  };
  
  // Helper to pick the first image url or a placeholder
  export const firstImage = (images?: Array<{ image_url?: string }>) =>
    images?.find((i) => !!i.image_url)?.image_url ?? '/images/placeholder.jpg';
  