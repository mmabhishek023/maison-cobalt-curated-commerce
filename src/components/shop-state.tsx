import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { toast } from "sonner";

import type { Product } from "@/lib/catalog";

export type CartLine = { product: Product; quantity: number };

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => boolean;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const ShopStateContext = createContext<ShopState | null>(null);

export function ShopStateProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cartValue = window.localStorage.getItem("aurel-cart");
      const wishlistValue = window.localStorage.getItem("aurel-wishlist");
      if (cartValue) {
        const parsed: unknown = JSON.parse(cartValue);
        if (Array.isArray(parsed)) setCart(parsed as CartLine[]);
      }
      if (wishlistValue) {
        const parsed: unknown = JSON.parse(wishlistValue);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
          setWishlist(parsed);
        }
      }
    } catch {
      window.localStorage.removeItem("aurel-cart");
      window.localStorage.removeItem("aurel-wishlist");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("aurel-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("aurel-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<ShopState>(() => {
    const addToCart = (product: Product, quantity = 1) => {
      if (product.stock < 1 || quantity < 1) {
        toast.error("This item is currently unavailable.");
        return false;
      }
      setCart((current) => {
        const existing = current.find((line) => line.product.id === product.id);
        if (!existing) return [...current, { product, quantity: Math.min(quantity, product.stock) }];
        return current.map((line) =>
          line.product.id === product.id
            ? { ...line, product, quantity: Math.min(product.stock, line.quantity + quantity) }
            : line,
        );
      });
      toast.success("Added to your bag.");
      return true;
    };
    const setQuantity = (productId: string, quantity: number) => {
      setCart((current) =>
        current
          .map((line) =>
            line.product.id === productId
              ? { ...line, quantity: Math.min(line.product.stock, Math.max(0, quantity)) }
              : line,
          )
          .filter((line) => line.quantity > 0),
      );
    };
    const removeFromCart = (productId: string) => {
      setCart((current) => current.filter((line) => line.product.id !== productId));
    };
    const toggleWishlist = (productId: string) => {
      setWishlist((current) =>
        current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
      );
    };
    return {
      cart,
      wishlist,
      cartCount: cart.reduce((total, line) => total + line.quantity, 0),
      subtotal: cart.reduce((total, line) => total + line.product.price * line.quantity, 0),
      addToCart,
      setQuantity,
      removeFromCart,
      toggleWishlist,
      isWishlisted: (productId) => wishlist.includes(productId),
    };
  }, [cart, wishlist]);

  return <ShopStateContext.Provider value={value}>{children}</ShopStateContext.Provider>;
}

export function useShopState() {
  const state = useContext(ShopStateContext);
  if (!state) throw new Error("useShopState must be used within ShopStateProvider");
  return state;
}