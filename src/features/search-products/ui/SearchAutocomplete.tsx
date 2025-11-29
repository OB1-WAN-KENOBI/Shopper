import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2 } from "lucide-react";
import { useSearch } from "../model/useSearch";
import { cn } from "@/shared/lib";
import type { Product } from "@/entities/product";

interface SearchAutocompleteProps {
  onSelect?: (product: Product) => void;
  className?: string;
}

export function SearchAutocomplete({
  onSelect,
  className,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading } = useSearch(query);

  useEffect(() => {
    setIsOpen(query.length > 0 && (results.length > 0 || loading));
  }, [query, results, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery("");
    setIsOpen(false);
    onSelect?.(product);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelect(results[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search smartphones, accessories..."
          className={cn(
            "w-full rounded-lg border border-input bg-background/50 backdrop-blur-sm px-10 py-2.5 pr-8 text-sm",
            "ring-offset-background transition-all duration-200",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:border-primary hover:border-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full rounded-lg border bg-popover shadow-lg"
            role="listbox"
          >
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto p-1">
                {results.map((product, index) => (
                  <li
                    key={product.id}
                    role="option"
                    aria-selected={index === focusedIndex}
                  >
                    <motion.button
                      onClick={() => handleSelect(product)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        "w-full rounded-md px-3 py-2 text-left transition-colors",
                        "hover:bg-accent focus:bg-accent focus:outline-none",
                        index === focusedIndex && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-10 w-10 rounded object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  </li>
                ))}
              </ul>
            ) : query.length > 0 && !loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No products found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
