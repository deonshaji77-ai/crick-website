"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductsFromFirestore, getSiteSettingsFromFirestore, type SiteSettingsData } from './firestore';

export type Product = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  category: string;
  categorySlug?: string;
  funnel?: string;
  image: string;
  weight?: string;
  edge?: string;
  willowGrade?: string;
  isSoldOut?: boolean;
};

export type CommunityMember = {
  id: string;
  name: string;
  image: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: "tb1", name: "Striker Pro", originalPrice: "₹2,799", price: "₹2,519", discount: "10% off", category: "Tennis Bat", weight: "950g", edge: "40mm", image: "/images/tennis_bat.jpg" },
  { id: "tb2", name: "Gladiator Scoop", originalPrice: "₹3,555", price: "₹3,200", discount: "10% off", category: "Tennis Bat", weight: "980g", edge: "42mm", image: "/images/tennis_bat.jpg" },
  { id: "lb1", name: "Reserve Willow V1", originalPrice: "₹20,555", price: "₹18,500", discount: "10% off", category: "Leather Bat", weight: "1160g", edge: "38mm", image: "/images/leather_bat.jpg" },
  { id: "lb2", name: "Classic Purist", originalPrice: "₹26,666", price: "₹24,000", discount: "10% off", category: "Leather Bat", weight: "1140g", edge: "40mm", image: "/images/leather_bat.jpg" },
  { id: "g1", name: "Pro 1.0 Batting Gloves", originalPrice: "₹4,666", price: "₹4,200", discount: "10% off", category: "Gloves", image: "/images/batting_gloves.jpg" },
  { id: "p1", name: "Pro 1.0 Thigh Pad", originalPrice: "₹2,799", price: "₹2,519", discount: "10% off", category: "Pads", image: "/images/batting_gloves.jpg" },
  { id: "b1", name: "Tour Duffle Bag", originalPrice: "₹7,555", price: "₹6,800", discount: "10% off", category: "Bags", image: "/images/batting_gloves.jpg" },
  { id: "h1", name: "Titanium Helmet", originalPrice: "₹9,444", price: "₹8,500", discount: "10% off", category: "Helmets", image: "/images/batting_gloves.jpg" },
];

const DEFAULT_COMMUNITY: CommunityMember[] = [
  { id: "c1", name: "Player 1", image: "" },
  { id: "c2", name: "Player 2", image: "" },
  { id: "c3", name: "Player 3", image: "" },
  { id: "c4", name: "Player 4", image: "" },
  { id: "c5", name: "Player 5", image: "" },
  { id: "c6", name: "Player 6", image: "" },
];

type StoreContextType = {
  products: Product[];
  community: CommunityMember[];
  
  // Visual CMS State
  isEditorOpen: boolean;
  editingCollection: string | null;
  editingItem: any | null;
  openEditor: (collection: string, item?: any) => void;
  closeEditor: () => void;

  // Generic CRUD
  addItem: (collection: 'products' | 'community', item: any) => void;
  updateItem: (collection: 'products' | 'community', id: string, updates: any) => void;
  deleteItem: (collection: 'products' | 'community', id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  // Site Settings
  siteSettings: SiteSettingsData | null;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [community, setCommunity] = useState<CommunityMember[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);

  // Visual CMS State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const openEditor = (collection: string, item: any = null) => {
    setEditingCollection(collection);
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingCollection(null);
    setEditingItem(null);
  };

  useEffect(() => {
    const load = (key: string, defaultData: any) => {
      const saved = localStorage.getItem(key);
      try {
        return saved ? JSON.parse(saved) : defaultData;
      } catch (e) {
        return defaultData;
      }
    };
    
    const fetchDatabaseProducts = async () => {
      try {
        const dbProducts = await getProductsFromFirestore();
        if (dbProducts && dbProducts.length > 0) {
          const mapped = dbProducts.map((p: any) => {
            const weight = p.specifications?.find((s:any) => s.key.toLowerCase() === 'weight')?.value;
            const edge = p.specifications?.find((s:any) => s.key.toLowerCase() === 'edge')?.value;
            
            let storeCategory = p.category;
            if (p.category === 'Leather Ball Bats') storeCategory = 'Leather Bat';
            if (p.category === 'Tennis Ball Bats') storeCategory = 'Tennis Bat';
            if (p.category === 'Batting Gloves') storeCategory = 'Gloves';
            if (p.category === 'Batting Pads') storeCategory = 'Pads';

            return {
              id: p.id,
              name: p.name,
              price: `₹${p.basePrice.toLocaleString('en-IN')}`,
              category: storeCategory,
              categorySlug: p.categorySlug,
              image: p.image,
              weight: weight,
              edge: edge,
              isSoldOut: false
            };
          });
          setProducts(mapped);
          setCommunity(load('rj doctor bat_community_v2', DEFAULT_COMMUNITY));
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error("Failed to sync with DB", err);
      }
      
      try {
        const settings = await getSiteSettingsFromFirestore();
        if (settings) {
          setSiteSettings(settings);
        } else {
          // Fallback default settings
          setSiteSettings({
            whatsappNumber: "919876543210",
            storeAddress: "123 Cricket Lane, Mumbai, India",
            contactEmail: "support@rj doctor bat.com",
            businessHours: "Mon-Sat, 10 AM - 8 PM"
          });
        }
      } catch (err) {
        console.error("Failed to sync settings", err);
        setSiteSettings({
          whatsappNumber: "919876543210",
          storeAddress: "123 Cricket Lane, Mumbai, India",
          contactEmail: "support@rj doctor bat.com",
          businessHours: "Mon-Sat, 10 AM - 8 PM"
        });
      }
      
      // Fallback to local storage if DB is empty or fails
      setProducts(load('rj doctor bat_products_v2', DEFAULT_PRODUCTS));
      setCommunity(load('rj doctor bat_community_v2', DEFAULT_COMMUNITY));
      setIsLoaded(true);
    };

    fetchDatabaseProducts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rj doctor bat_products_v2', JSON.stringify(products));
      localStorage.setItem('rj doctor bat_community_v2', JSON.stringify(community));
    }
  }, [products, community, isLoaded]);

  const addItem = (collection: string, item: any) => {
    const newItem = { ...item, id: `${collection}_${Date.now()}` };
    if (collection === 'products') setProducts(p => [...p, newItem]);
    if (collection === 'community') setCommunity(c => [...c, newItem]);
  };

  const updateItem = (collection: string, id: string, updates: any) => {
    const updater = (prev: any[]) => prev.map(p => p.id === id ? { ...p, ...updates } : p);
    if (collection === 'products') setProducts(updater);
    if (collection === 'community') setCommunity(updater);
  };

  const deleteItem = (collection: string, id: string) => {
    const filterer = (prev: any[]) => prev.filter(p => p.id !== id);
    if (collection === 'products') setProducts(filterer);
    if (collection === 'community') setCommunity(filterer);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  return (
    <StoreContext.Provider value={{ 
      products, community,
      addItem, updateItem, deleteItem,
      isEditorOpen, editingCollection, editingItem, openEditor, closeEditor,
      cart, addToCart, removeFromCart, updateCartQuantity,
      isCartOpen, setIsCartOpen,
      siteSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
