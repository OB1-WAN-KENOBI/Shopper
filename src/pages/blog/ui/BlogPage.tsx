import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ScrollToTop, Toast } from "@/shared/ui";
import { useToastContext } from "@/app/providers";
import { CartModal, FloatingCartButton } from "@/widgets/cart-modal";
import { useModal } from "@/shared/lib";
import { ExternalLink, Calendar, User } from "lucide-react";
import { Card } from "@/shared/ui/card";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  urlToImage?: string;
}

export function BlogPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const cartModal = useModal();
  const toast = useToastContext();

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);

        // Try multiple free APIs for tech news
        const apis = [
          // Hacker News API (free, no key needed)
          async () => {
            const topStories = await fetch(
              "https://hacker-news.firebaseio.com/v0/topstories.json"
            ).then((r) => r.json());

            const stories = await Promise.all(
              topStories
                .slice(0, 12)
                .map((id: number) =>
                  fetch(
                    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                  ).then((r) => r.json())
                )
            );

            return stories
              .filter((s: any) => s.title && s.url)
              .map((s: any) => ({
                title: s.title,
                description: s.title,
                url: s.url,
                publishedAt: new Date(s.time * 1000).toISOString(),
                source: "Hacker News",
                urlToImage: undefined,
              }));
          },
          // NewsAPI (requires key)
          async () => {
            const apiKey = import.meta.env.VITE_NEWS_API_KEY;
            if (!apiKey) throw new Error("No API key");

            const response = await fetch(
              `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=12&apiKey=${apiKey}`
            );

            if (!response.ok) throw new Error("API error");

            const data = await response.json();
            return data.articles
              .filter((a: any) => a.title && a.description)
              .map((a: any) => ({
                title: a.title,
                description: a.description || "",
                url: a.url,
                publishedAt: a.publishedAt,
                source: a.source?.name || "Unknown",
                urlToImage: a.urlToImage,
              }));
          },
        ];

        // Try APIs in order
        let articles: NewsArticle[] = [];
        for (const api of apis) {
          try {
            articles = await api();
            if (articles.length > 0) break;
          } catch (error) {
            console.warn("API failed, trying next:", error);
          }
        }

        if (articles.length === 0) {
          // Fallback to mock data
          articles = getMockArticles();
        }

        setArticles(articles);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setArticles(getMockArticles());
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  function getMockArticles(): NewsArticle[] {
    return [
      {
        title: "The Future of AI in E-Commerce",
        description:
          "Artificial intelligence is revolutionizing online shopping with personalized recommendations, chatbots, and automated inventory management.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Tech News",
      },
      {
        title: "Sustainable Electronics: The Next Big Trend",
        description:
          "Manufacturers are focusing on eco-friendly materials and energy-efficient designs to meet growing consumer demand for sustainable products.",
        url: "#",
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        source: "Green Tech",
      },
      {
        title: "5G Technology: What It Means for Smartphones",
        description:
          "The rollout of 5G networks is enabling faster download speeds and new features in mobile devices, transforming how we use our phones.",
        url: "#",
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        source: "Mobile World",
      },
      {
        title: "Wireless Charging Advances",
        description:
          "New wireless charging technologies are making it easier to power devices without cables, with improved efficiency and range.",
        url: "#",
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        source: "Tech Innovations",
      },
      {
        title: "Smart Home Integration",
        description:
          "Modern electronics are increasingly designed to work together, creating seamless smart home ecosystems controlled from your smartphone.",
        url: "#",
        publishedAt: new Date(Date.now() - 345600000).toISOString(),
        source: "Home Tech",
      },
      {
        title: "The Rise of Foldable Devices",
        description:
          "Foldable smartphones and tablets are becoming mainstream, offering larger screens in compact form factors.",
        url: "#",
        publishedAt: new Date(Date.now() - 432000000).toISOString(),
        source: "Device News",
      },
    ];
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={cartModal.open} />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <h1 className="text-6xl lg:text-7xl font-semibold mb-8 tracking-tight">
              Tech Blog
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              Stay updated with the latest technology news, trends, and insights
              from the world of electronics
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="p-6 animate-pulse bg-card/50 rounded-2xl"
                >
                  <div className="h-48 bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {article.urlToImage && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-light">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(article.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {article.source}
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold mb-4 line-clamp-2 tracking-tight">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 flex-1 line-clamp-3 font-light leading-relaxed">
                        {article.description}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Read more
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartModal isOpen={cartModal.isOpen} onClose={cartModal.close} />
      <FloatingCartButton onClick={cartModal.open} />
      <ScrollToTop />
      <Toast isVisible={toast.isVisible} message={toast.message} />
    </div>
  );
}
