"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchResults } from "../components/SearchResults";
import { SearchIcon, ArrowLeftIcon } from "../components/Icons";
import { PromoDisplayModel } from "../types";

interface SearchPageClientProps {
  initialPromos: PromoDisplayModel[];
  initialQuery: string;
}

export function SearchPageClient({ initialPromos, initialQuery }: SearchPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Debounce the URL update
    startTransition(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      } else {
        router.push('/search', { scroll: false });
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Sticky header with search */}
      <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-deep/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Back to home */}
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-bg-surface text-text-muted transition-all hover:border-accent-primary/40 hover:text-accent-primary"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>

            {/* Logo / Title - clickable */}
            <Link href="/" className="hidden sm:block shrink-0">
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                <span className="text-accent-primary">Save</span>
                <span className="text-accent-success">Support</span>
              </h1>
            </Link>

            {/* Search bar */}
            <div
              className={`relative flex-1 rounded-xl bg-bg-surface transition-all duration-300 ${
                isFocused
                  ? "shadow-[0_0_0_2px_var(--accent-primary)]"
                  : "shadow-[0_0_0_1px_var(--border-subtle)]"
              }`}
            >
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon
                  className={`h-5 w-5 transition-colors ${
                    isFocused ? "text-accent-primary" : "text-text-muted"
                  }`}
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by company, creator, or category..."
                className="w-full bg-transparent py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted/60 focus:outline-none"
              />
              {isPending && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <SearchResults
          promos={initialPromos}
          query={searchQuery || undefined}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-surface/30">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-text-muted/50">
            Promo codes sourced from YouTube videos. Click a deal card for details or use the copy button.
          </p>
        </div>
      </footer>
    </div>
  );
}

