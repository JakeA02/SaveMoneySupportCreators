"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleQuickSearch = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-deep">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-success/5 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main content */}
      <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo / Title Section */}
          <div className="mb-12 text-center animate-fade-in-up">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
              <span className="text-accent-primary">Save</span> Money
              <br />
              <span className="text-accent-success">Support</span> Creators
            </h1>
            <p className="mx-auto max-w-md text-base text-text-muted sm:text-lg">
              Find promo codes from YouTubers. 
              Save money while supporting creators.
            </p>
          </div>

          {/* Search Section */}
          <form onSubmit={handleSearch} className="animate-fade-in-up-delay-1">
            <div 
              className={`
                relative rounded-2xl bg-bg-surface transition-all duration-300
                ${isFocused 
                  ? 'shadow-[0_0_0_2px_var(--accent-primary),0_8px_40px_-12px_var(--accent-primary-glow)]' 
                  : 'shadow-[0_0_0_1px_var(--border-subtle),0_4px_24px_-8px_rgba(0,0,0,0.5)]'
                }
              `}
            >
              {/* Search Icon */}
              <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2">
                <svg 
                  className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-accent-primary' : 'text-text-muted'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>

              {/* Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by company, creator, or category..."
                className="w-full bg-transparent py-5 pl-14 pr-32 text-lg text-text-primary placeholder:text-text-muted/60 focus:outline-none sm:py-6 sm:text-xl"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-deep transition-all duration-200 hover:bg-accent-primary/90 hover:shadow-lg hover:shadow-accent-primary/25 active:scale-95 sm:px-6 sm:py-3 sm:text-base"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick search suggestions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up-delay-2">
            <span className="text-sm text-text-muted">Try:</span>
            {["NordVPN", "Squarespace", "Gaming", "Beauty", "Tech"].map((tag, index) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                className="rounded-full border border-border-subtle bg-bg-surface/50 px-4 py-1.5 text-sm text-text-muted transition-all duration-200 hover:border-accent-primary/40 hover:bg-accent-primary/10 hover:text-text-primary"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats preview */}
          <div className="mt-16 grid grid-cols-3 gap-4 animate-fade-in-up-delay-3">
            {[
              { value: "10K+", label: "Promo Codes" },
              { value: "2K+", label: "Creators" },
              { value: "500+", label: "Brands" },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="rounded-xl border border-border-subtle bg-bg-surface/30 p-4 text-center backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-accent-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-text-muted sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-text-muted/50">
            Codes sourced directly from YouTube videos
          </p>
        </div>
      </main>
    </div>
  );
}
