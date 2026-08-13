import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface ProductData {
  name: string;
  category: string;
  categorySlug?: string;
  funnel?: 'bats' | 'store';
  basePrice: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  weight?: string;
  edge?: string;
  grains?: string;
  willowGrade?: string;
  specifications: { key: string; value: string }[];
}

export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  image: string;
  funnel?: 'bats' | 'store';
  status: 'active' | 'draft';
  createdAt: string;
}

export interface OrderData {
  items: any[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CommunityGalleryItem {
  playerName: string;
  imageUrl: string;
  createdAt: string;
}

export interface CustomBatSpec {
  name: string;
  inputType: 'text' | 'number' | 'dropdown';
  options: string[]; // only for dropdown
  isRequired: boolean;
  createdAt: string;
}

export const addProductToFirestore = async (data: ProductData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const updateProductInFirestore = async (id: string, data: Partial<ProductData>) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating product: ', error);
    throw error;
  }
};

export const deleteProductFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product: ', error);
    throw error;
  }
};

export const getProductsFromFirestore = async () => {
  try {
    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products: ', error);
    throw error;
  }
};

export const addCategoryToFirestore = async (data: CategoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category: ', error);
    throw error;
  }
};

export const updateCategoryInFirestore = async (id: string, data: Partial<CategoryData>) => {
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating category: ', error);
    throw error;
  }
};

export const deleteCategoryFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category: ', error);
    throw error;
  }
};

export const getCategoriesFromFirestore = async () => {
  try {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const categories: any[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories: ', error);
    throw error;
  }
};

export const addCommunityGalleryItem = async (data: CommunityGalleryItem) => {
  try {
    const docRef = await addDoc(collection(db, 'community_gallery'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding gallery item: ', error);
    throw error;
  }
};

export const getCommunityGalleryItems = async () => {
  try {
    const q = query(collection(db, 'community_gallery'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return items;
  } catch (error) {
    console.error('Error fetching gallery items: ', error);
    throw error;
  }
};

export const deleteCommunityGalleryItem = async (id: string) => {
  try {
    const docRef = doc(db, 'community_gallery', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting gallery item: ', error);
    throw error;
  }
};

export const addCustomBatSpec = async (data: CustomBatSpec) => {
  try {
    const docRef = await addDoc(collection(db, 'custom_bat_specs'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding custom bat spec: ', error);
    throw error;
  }
};

export const updateCustomBatSpec = async (id: string, data: Partial<CustomBatSpec>) => {
  try {
    const docRef = doc(db, 'custom_bat_specs', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating custom bat spec: ', error);
    throw error;
  }
};

export const deleteCustomBatSpec = async (id: string) => {
  try {
    const docRef = doc(db, 'custom_bat_specs', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting custom bat spec: ', error);
    throw error;
  }
};

export const getCustomBatSpecs = async () => {
  try {
    const q = query(collection(db, 'custom_bat_specs'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const specs: any[] = [];
    querySnapshot.forEach((doc) => {
      specs.push({ id: doc.id, ...doc.data() });
    });
    return specs;
  } catch (error) {
    console.error('Error fetching custom bat specs: ', error);
    throw error;
  }
};

export const addOrderToFirestore = async (data: OrderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding order: ', error);
    throw error;
  }
};

export const getOrdersFromFirestore = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: any[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders: ', error);
    throw error;
  }
};

export const updateOrderStatusInFirestore = async (id: string, status: string) => {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating order status: ', error);
    throw error;
  }
};

export interface SiteSettingsData {
  whatsappNumber: string;
  storeAddress: string;
  contactEmail: string;
  businessHours: string;
}

export const getSiteSettingsFromFirestore = async (): Promise<SiteSettingsData | null> => {
  try {
    const q = query(collection(db, 'settings'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as SiteSettingsData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching site settings: ', error);
    throw error;
  }
};

export const updateSiteSettingsInFirestore = async (data: SiteSettingsData) => {
  try {
    const q = query(collection(db, 'settings'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'settings', querySnapshot.docs[0].id);
      await updateDoc(docRef, data as any);
    } else {
      await addDoc(collection(db, 'settings'), data);
    }
  } catch (error) {
    console.error('Error updating site settings: ', error);
    throw error;
  }
};

export interface ReviewData {
  name: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

export const addReviewToFirestore = async (data: ReviewData) => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding review: ', error);
    throw error;
  }
};

export const getReviewsFromFirestore = async () => {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reviews: any[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews: ', error);
    throw error;
  }
};

export const deleteReviewFromFirestore = async (id: string) => {
  try {
    const docRef = doc(db, 'reviews', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting review: ', error);
    throw error;
  }
};
