import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui";
import { useCartContext } from "@/app/providers";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/shared/lib";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, total, removeItem, updateQuantity, clearCart, formatPrice } =
    useCartContext();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Cart is empty!");
      return;
    }
    alert("Thank you for your order!");
    clearCart();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="full" className="flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Looks like you haven't added any items yet. Start shopping to fill your cart with amazing products!"
              action={{
                label: "Continue Shopping",
                onClick: onClose,
              }}
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border bg-card p-4",
                    "transition-all hover:shadow-md"
                  )}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    loading="lazy"
                    className="h-16 w-16 rounded-lg object-contain bg-muted"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[2rem] text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex w-full items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="ml-2 text-2xl font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
            <Button onClick={handleCheckout} size="lg" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Checkout
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
