import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type CartItem = {
  product_id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  price_aed: number;
  image: string | null;
  qty: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (product_id: string, qty: number) => void;
  removeItem: (product_id: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'abdulkareem-auto-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [items]);

  const addItem: CartContextValue['addItem'] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === item.product_id);
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, item.stock);
        return prev.map((i) =>
          i.product_id === item.product_id ? { ...i, qty: nextQty } : i
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, item.stock) }];
    });
    setIsOpen(true);
  };

  const updateQty: CartContextValue['updateQty'] = (product_id, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.product_id !== product_id);
      return prev.map((i) =>
        i.product_id === product_id ? { ...i, qty: Math.min(qty, i.stock) } : i
      );
    });
  };

  const removeItem: CartContextValue['removeItem'] = (product_id) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  };

  const clear = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price_aed, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        updateQty,
        removeItem,
        clear,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
