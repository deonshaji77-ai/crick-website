import { unstable_cache } from 'next/cache';
import { getProductsFromFirestore, getCategoriesFromFirestore, getCommunityGalleryItems, getReviewsFromFirestore, getSiteSettingsFromFirestore } from './firestore';

export const getCachedProducts = unstable_cache(
  async () => {
    return await getProductsFromFirestore();
  },
  ['products-cache-v2'],
  { revalidate: 300, tags: ['products'] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    return await getCategoriesFromFirestore();
  },
  ['categories-cache'],
  { revalidate: 300, tags: ['categories'] }
);

export const getCachedActiveCategories = unstable_cache(
  async () => {
    const all = await getCategoriesFromFirestore();
    return all.filter((c: any) => c.status === 'active' || !c.status); // Default to active if status is missing
  },
  ['active-categories-cache'],
  { revalidate: 300, tags: ['categories'] }
);

export const getCachedCommunityGallery = unstable_cache(
  async () => {
    return await getCommunityGalleryItems();
  },
  ['gallery-cache'],
  { revalidate: 300, tags: ['gallery'] }
);

export const getCachedReviews = unstable_cache(
  async () => {
    return await getReviewsFromFirestore();
  },
  ['reviews-cache'],
  { revalidate: 60, tags: ['reviews'] }
);

export const getCachedSettings = unstable_cache(
  async () => {
    return await getSiteSettingsFromFirestore();
  },
  ['settings-cache'],
  { revalidate: 300, tags: ['settings'] }
);
