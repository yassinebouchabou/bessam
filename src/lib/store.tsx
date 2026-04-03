
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, CartItem, SiteSettings, Order, DeliveryTariff, Category } from './types';
import { 
  doc, 
  onSnapshot, 
  collection,
  FirestoreError
} from 'firebase/firestore';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface PixelCartContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  logout: () => void;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  deliveryTariffs: DeliveryTariff[];
  updateDeliveryTariff: (stateId: string, tariff: DeliveryTariff) => void;
}

const PixelCartContext = createContext<PixelCartContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "BRICO PRO DZ",
  logoUrl: "https://ibb.co/kgx29FB2",
  primaryColor: "210 50% 37%",
  checkoutColor: "210 50% 37%",
  checkoutBgColor: "0 0% 100%",
  priceBadgeColor: "24 95% 53%",
  checkoutTitleAr: "اطلب الآن",
  checkoutButtonTextAr: "اطلب الآن",
  checkoutSuccessMsgAr: "شكرا، سنتصل بك قريبا لتأكيد الطلب.",
  nameLabelAr: "الاسم الكامل",
  phoneLabelAr: "رقم الهاتف",
  stateLabelAr: "الولاية",
  communeLabelAr: "البلدية"
};

const SUPER_ADMIN_UID = 'cgeNA9jvuCeC42zZV4EcntT21Jw2';

export const PixelCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { firestore, user: firebaseUser, auth } = useFirebase();
  const [user, setUserState] = useState<User | null>(null);
  const [products, setProductsState] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [deliveryTariffs, setDeliveryTariffs] = useState<DeliveryTariff[]>([]);

  useEffect(() => {
    if (firebaseUser) {
      const email = firebaseUser.email?.toLowerCase() || '';
      const isAdmin = firebaseUser.uid === SUPER_ADMIN_UID;
      setUserState({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: email,
        isAdmin: isAdmin
      });
    } else {
      setUserState(null);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!firestore || !firebaseUser) return;
    if (firebaseUser.uid === SUPER_ADMIN_UID) return;
    
    const adminRef = doc(firestore, 'roles_admin', firebaseUser.uid);
    return onSnapshot(
      adminRef, 
      (docSnap) => {
        const isAdmin = docSnap.exists();
        setUserState(prev => prev ? { ...prev, isAdmin } : null);
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: adminRef.path,
          operation: 'get'
        }));
      }
    );
  }, [firestore, firebaseUser]);

  useEffect(() => {
    if (!firestore) return;
    const settingsRef = doc(firestore, 'settings', 'config');
    return onSnapshot(
      settingsRef, 
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteSettings;
          setSettings(data);
          document.documentElement.style.setProperty('--primary', data.primaryColor);
        } else if (user?.isAdmin) {
          setDocumentNonBlocking(settingsRef, DEFAULT_SETTINGS, { merge: true });
        }
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: settingsRef.path,
          operation: 'get'
        }));
      }
    );
  }, [firestore, user?.isAdmin]);

  useEffect(() => {
    if (!firestore) return;
    const productsRef = collection(firestore, 'products');
    return onSnapshot(
      productsRef, 
      (snapshot) => {
        const results: Product[] = [];
        snapshot.forEach(doc => {
          results.push({ ...doc.data() as Product, id: doc.id });
        });
        setProductsState(results);
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: productsRef.path,
          operation: 'list'
        }));
      }
    );
  }, [firestore]);

  useEffect(() => {
    if (!firestore) return;
    const categoriesRef = collection(firestore, 'categories');
    return onSnapshot(
      categoriesRef, 
      (snapshot) => {
        const results: Category[] = [];
        snapshot.forEach(doc => {
          results.push({ ...doc.data() as Category, id: doc.id });
        });
        setCategoriesState(results);
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: categoriesRef.path,
          operation: 'list'
        }));
      }
    );
  }, [firestore]);

  useEffect(() => {
    if (!firestore || !user?.isAdmin) {
      setOrders([]);
      return;
    }
    const ordersRef = collection(firestore, 'orders');
    return onSnapshot(
      ordersRef, 
      (snapshot) => {
        const results: Order[] = [];
        snapshot.forEach(doc => {
          results.push({ ...doc.data() as Order, id: doc.id });
        });
        setOrders(results);
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ordersRef.path,
          operation: 'list'
        }));
      }
    );
  }, [firestore, user?.isAdmin]);

  useEffect(() => {
    if (!firestore) return;
    const tariffsRef = collection(firestore, 'delivery_tariffs');
    return onSnapshot(
      tariffsRef, 
      (snapshot) => {
        const results: DeliveryTariff[] = [];
        snapshot.forEach(doc => {
          results.push({ ...doc.data() as DeliveryTariff, stateName: doc.id });
        });
        setDeliveryTariffs(results);
      },
      (error: FirestoreError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: tariffsRef.path,
          operation: 'list'
        }));
      }
    );
  }, [firestore]);

  useEffect(() => {
    const storedCart = localStorage.getItem('pixelcart_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('pixelcart_cart', JSON.stringify(cart));
  }, [cart]);

  const setUser = (newUser: User | null) => setUserState(newUser);

  const logout = () => {
    if (auth) auth.signOut();
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', order.id);
    setDocumentNonBlocking(orderRef, order, { merge: true });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!firestore) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      const orderRef = doc(firestore, 'orders', orderId);
      updateDocumentNonBlocking(orderRef, { status });
      return;
    }

    if (status === 'delivered' && order.status !== 'delivered') {
      const product = products.find(p => p.id === order.productId);
      if (product) {
        const productRef = doc(firestore, 'products', product.id);
        
        if (order.selectedVariant && product.variants) {
          const updatedVariants = product.variants.map(v => {
            if (v.name === order.selectedVariant) {
              return { ...v, countInStock: Math.max(0, v.countInStock - order.quantity) };
            }
            return v;
          });
          
          updateDocumentNonBlocking(productRef, {
            variants: updatedVariants,
            countInStock: Math.max(0, product.countInStock - order.quantity)
          });
        } else {
          updateDocumentNonBlocking(productRef, {
            countInStock: Math.max(0, product.countInStock - order.quantity)
          });
        }
      }
    }

    const orderRef = doc(firestore, 'orders', orderId);
    updateDocumentNonBlocking(orderRef, { status });
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    if (!firestore) return;
    const settingsRef = doc(firestore, 'settings', 'config');
    updateDocumentNonBlocking(settingsRef, newSettings);
  };

  const updateDeliveryTariff = (stateId: string, tariff: DeliveryTariff) => {
    if (!firestore) return;
    const tariffRef = doc(firestore, 'delivery_tariffs', stateId);
    setDocumentNonBlocking(tariffRef, tariff, { merge: true });
  };

  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> = (val) => {
    if (typeof val === 'function') {
      const updated = val(products);
      setProductsState(updated);
    } else {
      setProductsState(val);
    }
  };

  return (
    <PixelCartContext.Provider value={{
      user,
      setUser,
      products,
      setProducts,
      categories,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      orders,
      addOrder,
      updateOrderStatus,
      logout,
      settings,
      updateSettings,
      deliveryTariffs,
      updateDeliveryTariff
    }}>
      {children}
    </PixelCartContext.Provider>
  );
};

export const usePixelCart = () => {
  const context = useContext(PixelCartContext);
  if (!context) throw new Error('usePixelCart must be used within PixelCartProvider');
  return context;
};
