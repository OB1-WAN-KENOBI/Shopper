import { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/entities/cart";

const CartContext = createContext<ReturnType<typeof useCart> | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
