import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ProductCard, ProductCardSkeleton } from "@/entities/product";
import { CartModal, FloatingCartButton } from "@/widgets/cart-modal";
import { ScrollToTop, Toast } from "@/shared/ui";
import { useToastContext, useCartContext } from "@/app/providers";
import { useModal } from "@/shared/lib";
import { ProductModal } from "@/widgets/cart-modal";
import { fetchCategories } from "@/shared/api";
import { getProducts } from "@/entities/product/api/productApi";
import type { Product } from "@/entities/product";
import { Filter, X } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");

  const cartModal = useModal();
  const toast = useToastContext();
  const { addItem } = useCartContext();
  const productModal = useModal();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const allProducts: Product[] = [];

        // Загружаем больше продуктов из категории smartphones для получения брендов
        const smartphoneProds = await getProducts("smartphones", 100);
        allProducts.push(...smartphoneProds);

        // Загружаем из других категорий электроники
        const cats = await fetchCategories();
        const otherCats = cats
          .filter((cat) => cat !== "smartphones")
          .slice(0, 4);

        for (const cat of otherCats) {
          const prods = await getProducts(cat, 30);
          allProducts.push(...prods);
        }

        // Удаляем дубликаты по ID
        const uniqueProducts = Array.from(
          new Map(allProducts.map((p) => [p.id, p])).values()
        );

        setProducts(uniqueProducts);

        // Extract unique brands from all products
        const uniqueBrands = Array.from(
          new Set(
            uniqueProducts
              .map((p) => p.brand)
              .filter(
                (b): b is string =>
                  Boolean(b) && typeof b === "string" && b.trim() !== ""
              )
          )
        ).sort();

        setBrands(uniqueBrands);

        console.log("Loaded products:", uniqueProducts.length);
        console.log("Loaded brands:", uniqueBrands);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrand, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.show("Added to cart!");
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    productModal.open();
  };

  const maxPrice =
    products.length > 0
      ? Math.max(...products.map((p) => p.price), 5000)
      : 5000;

  // Update price range when products change
  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price));
      const newMax = Math.ceil(max / 100) * 100;
      if (newMax !== priceRange[1] && newMax > 0) {
        setPriceRange([0, newMax]);
      }
    }
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={cartModal.open} />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 lg:mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-semibold mb-4 tracking-tight">
              Products
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Discover our complete collection of electronics
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-80 max-w-[85vw] h-full bg-card border-r border-border/50 overflow-y-auto shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Filters
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                        Brand
                      </h3>
                      {brands.length > 0 ? (
                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                          <button
                            onClick={() => setSelectedBrand("all")}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                              selectedBrand === "all"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted/50 hover:bg-muted text-foreground"
                            }`}
                          >
                            All Brands
                          </button>
                          {brands.map((brand) => (
                            <button
                              key={brand}
                              onClick={() => setSelectedBrand(brand)}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                selectedBrand === brand
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "bg-muted/50 hover:bg-muted text-foreground"
                              }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Loading brands...
                        </p>
                      )}
                    </div>

                    {/* Price Range */}
                    <div>
                      <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                        Price Range
                      </h3>
                      <div className="mb-3">
                        <p className="text-lg font-semibold">
                          ${priceRange[0].toLocaleString()} - $
                          {priceRange[1].toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange[0]}
                            onChange={(e) => {
                              const newMin = Number(e.target.value);
                              if (newMin <= priceRange[1]) {
                                setPriceRange([newMin, priceRange[1]]);
                              }
                            }}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            style={{
                              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                                (priceRange[0] / maxPrice) * 100
                              }%, hsl(var(--muted)) ${
                                (priceRange[0] / maxPrice) * 100
                              }%, hsl(var(--muted)) 100%)`,
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => {
                              const newMax = Number(e.target.value);
                              if (newMax >= priceRange[0]) {
                                setPriceRange([priceRange[0], newMax]);
                              }
                            }}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            style={{
                              background: `linear-gradient(to right, hsl(var(--muted)) 0%, hsl(var(--muted)) ${
                                (priceRange[1] / maxPrice) * 100
                              }%, hsl(var(--primary)) ${
                                (priceRange[1] / maxPrice) * 100
                              }%, hsl(var(--primary)) 100%)`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </div>
            )}

            {/* Desktop Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="hidden lg:block lg:w-72 flex-shrink-0"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 space-y-8 sticky top-28">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Filters
                </h2>

                {/* Brand Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                    Brand
                  </h3>
                  {brands.length > 0 ? (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
                      <button
                        onClick={() => setSelectedBrand("all")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedBrand === "all"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/50 hover:bg-muted text-foreground"
                        }`}
                      >
                        All Brands
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            selectedBrand === brand
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Loading brands...
                    </p>
                  )}
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">
                    Price Range
                  </h3>
                  <div className="mb-3">
                    <p className="text-lg font-semibold">
                      ${priceRange[0].toLocaleString()} - $
                      {priceRange[1].toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = Number(e.target.value);
                          if (newMin <= priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                          }
                        }}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                            (priceRange[0] / maxPrice) * 100
                          }%, hsl(var(--muted)) ${
                            (priceRange[0] / maxPrice) * 100
                          }%, hsl(var(--muted)) 100%)`,
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = Number(e.target.value);
                          if (newMax >= priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                          }
                        }}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--muted)) 0%, hsl(var(--muted)) ${
                            (priceRange[1] / maxPrice) * 100
                          }%, hsl(var(--primary)) ${
                            (priceRange[1] / maxPrice) * 100
                          }%, hsl(var(--primary)) 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="outline"
                  className="lg:hidden rounded-xl px-4 py-2"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-sm text-muted-foreground font-medium">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-border/50 rounded-xl bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <p className="text-lg text-muted-foreground font-light">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onClick={() => handleCardClick(product)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartModal isOpen={cartModal.isOpen} onClose={cartModal.close} />
      <FloatingCartButton onClick={cartModal.open} />
      <ScrollToTop />
      <Toast isVisible={toast.isVisible} message={toast.message} />
      {selectedProduct && (
        <ProductModal
          isOpen={productModal.isOpen}
          onClose={() => {
            productModal.close();
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
