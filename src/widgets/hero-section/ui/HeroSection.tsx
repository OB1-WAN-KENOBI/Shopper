import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Product } from "@/entities/product";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { LoadingSpinner } from "@/shared/ui";
import { Sparkles, Star } from "lucide-react";

const FALLBACK_IPHONE_14: Product = {
  id: "iphone-14-hero",
  title: "iPhone 14",
  description:
    "A15 Bionic, dual‑camera system, and all‑day battery in the classic design you know.",
  price: 799,
  image:
    "https://images.unsplash.com/photo-1661961112957-4c7c11b9c5f8?auto=format&fit=crop&w=800&q=80",
  category: "smartphones",
  rating: 4.7,
  stock: 10,
  brand: "Apple",
};

export function HeroSection() {
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadHeroProduct() {
      try {
        const { getIphone } = await import("@/entities/product");
        const iphone = await getIphone();

        if (iphone) {
          setHeroProduct(iphone);
        } else {
          setHeroProduct(FALLBACK_IPHONE_14);
        }
      } catch (error) {
        console.error("Error loading hero product:", error);
        setHeroProduct(FALLBACK_IPHONE_14);
      }
    }
    loadHeroProduct();
  }, []);

  if (!heroProduct) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20">
        <div className="container relative mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover Our{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Latest Products
                </span>
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground sm:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {heroProduct?.description ||
                  "Discover cutting-edge technology and premium quality products designed to elevate your digital experience."}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="gap-2 text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-lg border-2 hover:bg-accent/50 transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <motion.img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "women" : "men"
                    }/${i * 10 + 1}.jpg`}
                    alt={`User ${i}`}
                    loading="lazy"
                    className="h-10 w-10 rounded-full border-2 border-background"
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    initial={{ x: -20 * i }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  15k Well Reviews
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8 backdrop-blur-sm">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                whileHover={{ opacity: 1 }}
              />
              <div className="relative space-y-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  {heroProduct.title}
                </p>
                <motion.img
                  src={heroProduct.image}
                  alt={heroProduct.title}
                  loading="eager"
                  className="mx-auto h-48 w-48 object-contain"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                />
                <p className="text-3xl font-bold text-primary">
                  ${heroProduct.price.toFixed(2)}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
