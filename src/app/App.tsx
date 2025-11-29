import { HashRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { ProductsPage } from "@/pages/products";
import { BlogPage } from "@/pages/blog";
import { AboutPage } from "@/pages/about";
import { FeaturesPage } from "@/pages/features";
import { CartProvider, ToastProvider } from "./providers";

function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
