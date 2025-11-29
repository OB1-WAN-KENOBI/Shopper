import { motion } from "motion/react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ScrollToTop, Toast } from "@/shared/ui";
import { useToastContext } from "@/app/providers";
import { CartModal, FloatingCartButton } from "@/widgets/cart-modal";
import { useModal } from "@/shared/lib";
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  Shield,
  Zap,
  Smartphone,
  Filter,
} from "lucide-react";
import { Card } from "@/shared/ui/card";

export function FeaturesPage() {
  const cartModal = useModal();
  const toast = useToastContext();

  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find exactly what you're looking for with our powerful search and filtering system. Filter by category, price, rating, and more.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: ShoppingCart,
      title: "Smart Cart",
      description:
        "Manage your shopping cart with ease. Add, remove, and update quantities instantly. Your cart is saved across sessions.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Heart,
      title: "Wishlist",
      description:
        "Save your favorite products for later. Create wishlists and never lose track of items you want to purchase.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Bell,
      title: "Price Alerts",
      description:
        "Get notified when products you're interested in go on sale. Never miss a great deal again.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description:
        "Shop with confidence. Our secure payment system protects your information with industry-standard encryption.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description:
        "Lightning-fast page loads and smooth navigation. We've optimized every aspect for the best user experience.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Shop on any device. Our responsive design works perfectly on desktop, tablet, and mobile phones.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Filter,
      title: "Smart Filters",
      description:
        "Narrow down your search with intelligent filters. Find products by category, price range, ratings, and specifications.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={cartModal.open} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-6xl lg:text-7xl font-semibold mb-8 tracking-tight">Features</h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                Discover all the powerful features that make shopping with us a
                breeze. From advanced search to secure checkout, we've got you
                covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                      <div
                        className={`p-4 rounded-xl ${feature.bgColor} w-fit mb-6`}
                      >
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-24 lg:py-32 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
                  Built for Modern Shopping
                </h2>
                <p className="text-xl text-muted-foreground font-light">
                  We continuously improve our platform to provide you with the
                  best shopping experience possible
                </p>
              </motion.div>

              <div className="grid gap-12 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-3xl font-semibold mb-6 tracking-tight">
                    User-Friendly Interface
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    Our intuitive design makes it easy to find and purchase
                    products. Whether you're a tech expert or a casual shopper,
                    you'll feel right at home.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-3xl font-semibold mb-6 tracking-tight">
                    Continuous Updates
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-light">
                    We regularly add new features and improvements based on user
                    feedback. Your shopping experience gets better with every
                    update.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartModal isOpen={cartModal.isOpen} onClose={cartModal.close} />
      <FloatingCartButton onClick={cartModal.open} />
      <ScrollToTop />
      <Toast isVisible={toast.isVisible} message={toast.message} />
    </div>
  );
}
