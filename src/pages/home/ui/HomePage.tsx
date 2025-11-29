import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { HeroSection } from "@/widgets/hero-section";
import { ProductList } from "@/widgets/product-list";
import { CartModal, FloatingCartButton } from "@/widgets/cart-modal";
import { ScrollToTop, Toast } from "@/shared/ui";
import { useToastContext } from "@/app/providers";
import { useModal } from "@/shared/lib";

export function HomePage() {
  const cartModal = useModal();
  const toast = useToastContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={cartModal.open} />
      <main className="flex-1">
        <HeroSection />
        <ProductList
          title="Top Sellers"
          description="Discover our best-selling smartphones and electronics, trusted by thousands of customers worldwide"
          category="smartphones"
          limit={8}
        />
        <ProductList
          title="Best Deals"
          description="Premium electronics at unbeatable prices"
          category="smartphones"
          limit={3}
          showViewAll={false}
        />
      </main>
      <Footer />
      <CartModal isOpen={cartModal.isOpen} onClose={cartModal.close} />
      <FloatingCartButton onClick={cartModal.open} />
      <ScrollToTop />
      <Toast isVisible={toast.isVisible} message={toast.message} />
    </div>
  );
}
