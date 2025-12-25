import { Suspense } from "react";
import { getLatestPromos, searchPromos } from "../lib/promos";
import { SearchPageClient } from "./SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  
  // Fetch data on the server
  const promos = query.trim() 
    ? await searchPromos(query) 
    : await getLatestPromos();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-deep">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
        </div>
      }
    >
      <SearchPageClient initialPromos={promos} initialQuery={query} />
    </Suspense>
  );
}
