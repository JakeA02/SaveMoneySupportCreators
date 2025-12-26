"use client";

import { useState } from "react";
import { PromoDisplayModel } from "../types";
import { CheckCircleIcon, CopyIcon } from "./Icons";

interface PromoCardProps {
  promo: PromoDisplayModel;
  onClick?: (promo: PromoDisplayModel) => void;
}

export function PromoCard({ promo, onClick }: PromoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  // Get the link - promo link takes priority, fallback to company link
  const promoLink = promo.link || promo.company.link;
  const logoURL = "https://img.logo.dev/name/" + promo.company.name.toLowerCase().replaceAll(" ", "") + "?token=pk_Qd7P2EDxSA2ZhTsPA52CaA"
  
  // Check if code is valid (not empty, null, space, or "Not Provided")
  const hasValidCode = promo.code && promo.code.trim() !== "" && promo.code.trim().toLowerCase() !== "not provided" && promo.code.trim().toLowerCase() !== "n/a";
  return (
    <div
      onClick={() => onClick?.(promo)}
      className="group relative w-full cursor-pointer rounded-xl border border-border-subtle bg-bg-surface p-5 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_8px_30px_-12px_rgba(56,189,248,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
    >
      {/* Verified badge */}
      {promo.isVerified && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent-success shadow-lg shadow-accent-success/30">
          <CheckCircleIcon className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Top section: Company info */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10 p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoURL}
            alt={`${promo.company.name} logo`}
            className="h-full w-full object-contain"
            onError={(e) => {
              // Fallback to first letter if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `<span class="text-xl font-bold text-text-primary">${promo.company.name.charAt(0)}</span>`;
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
             {promo.company.name}
          </h3>
          <p className="text-sm text-text-muted capitalize">
            {promo.company.productType}
          </p>
        </div>
      </div>

      {/* Headline */}
      <p className="mb-4 line-clamp-2 text-sm text-text-muted leading-relaxed">
        {promo.headline}
      </p>

      {/* Code display with copy button OR Go to Deal link */}
      {hasValidCode ? (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-bg-deep/50 px-4 py-3 border border-border-subtle">
          <code className="text-lg font-mono font-bold tracking-wider text-accent-primary">
            {promo.code}
          </code>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-text-muted transition-all hover:bg-accent-primary/10 hover:text-accent-primary"
            title="Copy code"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="h-4 w-4 text-accent-success" />
                <span className="text-xs text-accent-success">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </button>
        </div>
      ) : promoLink ? (
        <div className="mb-4 flex items-center justify-center rounded-lg bg-bg-deep/50 px-4 py-3 border border-border-subtle">
          <a
            href={promoLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="text-lg font-semibold text-accent-primary underline underline-offset-4 transition-colors hover:text-accent-primary/80"
          >
            Go to Deal →
          </a>
        </div>
      ) : null}

      {/* Footer: Creator & Link */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <div className="h-5 w-5 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent-primary">
              {promo.video.creator.name.charAt(0)}
            </span>
          </div>
          <span className="truncate max-w-[120px]">{promo.video.creator.name}</span>
        </div>
        {promoLink && (
          <a
            href={promoLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="text-accent-primary underline underline-offset-2 transition-colors hover:text-accent-primary/80"
          >
            Link
          </a>
        )}
      </div>
    </div>
  );
}
