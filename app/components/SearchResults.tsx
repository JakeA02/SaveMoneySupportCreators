"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PromoDisplayModel } from "../types";
import { PromoCard } from "./PromoCard";
import { PromoTable } from "./PromoTable";
import { GridIcon, TableIcon } from "./Icons";

type ViewMode = "grid" | "table";

interface SearchResultsProps {
  promos: PromoDisplayModel[];
  query?: string;
  onPromoClick?: (promo: PromoDisplayModel) => void;
}

export function SearchResults({ promos, query, onPromoClick }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const router = useRouter();

  const handlePromoClick = (promo: PromoDisplayModel) => {
    if (onPromoClick) {
      onPromoClick(promo);
    } else {
      // Navigate to the promo detail page
      router.push(`/promo/${promo.id}`);
    }
  };

  return (
    <div className="w-full">
      {/* Header with results count and view toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">
            {query ? (
              <>
                Results for{" "}
                <span className="text-accent-primary">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "All Promo Codes"
            )}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {promos.length} {promos.length === 1 ? "code" : "codes"} found
          </p>
          <p className="mt-4 text-xs text-text-muted">
            Click on a deal card to view the details and source of the deal.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-bg-surface p-1 border border-border-subtle self-start">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              viewMode === "grid"
                ? "bg-accent-primary text-bg-deep"
                : "text-text-muted hover:text-text-primary hover:bg-bg-deep/50"
            }`}
          >
            <GridIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              viewMode === "table"
                ? "bg-accent-primary text-bg-deep"
                : "text-text-muted hover:text-text-primary hover:bg-bg-deep/50"
            }`}
          >
            <TableIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {promos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-surface/50 py-16 text-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-bg-deep flex items-center justify-center">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            No codes found
          </h3>
          <p className="max-w-sm text-sm text-text-muted">
            {query
              ? `We couldn't find any promo codes matching "${query}". Try a different search term.`
              : "No promo codes available at the moment."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo, index) => (
            <div
              key={promo.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <PromoCard promo={promo} onClick={handlePromoClick} />
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="animate-fade-in-up">
          <PromoTable promos={promos} onRowClick={handlePromoClick} />
        </div>
      )}
    </div>
  );
}

