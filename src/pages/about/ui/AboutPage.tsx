import { motion } from "motion/react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ScrollToTop, Toast } from "@/shared/ui";
import { useToastContext } from "@/app/providers";
import { CartModal, FloatingCartButton } from "@/widgets/cart-modal";
import { useModal } from "@/shared/lib";
import {
  ShoppingBag,
  Shield,
  Truck,
  Headphones,
  Award,
  Users,
} from "lucide-react";
import { Card } from "@/shared/ui/card";

export function AboutPage() {
  const cartModal = useModal();
  const toast = useToastContext();

  const features = [
    {
      icon: ShoppingBag,
      title: "Wide Selection",
      description:
        "Browse thousands of products from top brands across all categories",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Your data and payments are protected with industry-leading security",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable shipping to get your products to you fast",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our customer service team is always here to help you",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "We only sell authentic products from verified suppliers",
    },
    {
      icon: Users,
      title: "Trusted by Millions",
      description: "Join millions of satisfied customers who shop with us",
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
              <h1 className="text-6xl lg:text-7xl font-semibold mb-8 tracking-tight">
                About Shopper
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                We are a leading online electronics store dedicated to providing
                you with the latest technology products at competitive prices.
                Our mission is to make cutting-edge electronics accessible to
                everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16"
              >
                <h2 className="text-5xl lg:text-6xl font-semibold mb-12 tracking-tight">Our Story</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                  <p>
                    Founded in 2020, Shopper started as a small online store
                    with a simple vision: to make technology accessible to
                    everyone. What began as a passion project has grown into one
                    of the most trusted names in online electronics retail.
                  </p>
                  <p>
                    We carefully curate our product selection, working directly
                    with manufacturers and authorized distributors to ensure
                    authenticity and quality. Every product in our catalog is
                    thoroughly tested and verified before it reaches our
                    customers.
                  </p>
                  <p>
                    Today, we serve customers worldwide, offering everything
                    from the latest smartphones and laptops to smart home
                    devices and accessories. Our commitment to customer
                    satisfaction, competitive pricing, and fast shipping has
                    made us a favorite among tech enthusiasts.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-5xl lg:text-6xl font-semibold mb-12 tracking-tight">Our Values</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                  <p>
                    <strong className="text-foreground">Quality First:</strong>{" "}
                    We never compromise on quality. Every product is carefully
                    selected and verified.
                  </p>
                  <p>
                    <strong className="text-foreground">Customer Focus:</strong>{" "}
                    Your satisfaction is our priority. We're here to help you
                    find exactly what you need.
                  </p>
                  <p>
                    <strong className="text-foreground">Innovation:</strong> We
                    stay ahead of the curve, always bringing you the latest and
                    greatest in technology.
                  </p>
                  <p>
                    <strong className="text-foreground">Transparency:</strong>{" "}
                    Honest pricing, clear policies, and straightforward
                    communication in everything we do.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 lg:py-32 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">Why Choose Us</h2>
              <p className="text-xl text-muted-foreground font-light">
                Everything you need for a great shopping experience
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">
                          {feature.title}
                        </h3>
                      </div>
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

        {/* Stats Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-4 text-center">
              {[
                { number: "1M+", label: "Happy Customers" },
                { number: "50K+", label: "Products" },
                { number: "100+", label: "Brands" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <div className="text-5xl lg:text-6xl font-semibold text-primary mb-3 tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-lg text-muted-foreground font-light">{stat.label}</div>
                </motion.div>
              ))}
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
