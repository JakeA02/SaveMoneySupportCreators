"use client";

import { PromoDisplayModel } from "../types";
import { CheckCircleIcon, CopyIcon } from "./Icons";
import { useState } from "react";

interface PromoTableProps {
  promos: PromoDisplayModel[];
  onRowClick?: (promo: PromoDisplayModel) => void;
}

export function PromoTable({ promos, onRowClick }: PromoTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (e: React.MouseEvent, promo: PromoDisplayModel) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(promo.code);
    setCopiedId(promo.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-deep/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted hidden sm:table-cell">
                Offer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                Creator
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-muted w-20">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-muted w-16">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {promos.map((promo) => {
              // Get the link - promo link takes priority, fallback to company link
              const promoLink = promo.link || promo.company.link;

              return (
                <tr
                  key={promo.id}
                  onClick={() => onRowClick?.(promo)}
                  className="group cursor-pointer transition-colors hover:bg-accent-primary/5"
                >
                  {/* Company */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/10 p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={promo.company.logoURL}
                          alt={promo.company.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement!.innerHTML = `<span class="text-sm font-bold text-text-primary">${promo.company.name.charAt(0)}</span>`;
                          }}
                        />
                      </div>
                      <span className="font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                        {promo.company.name}
                      </span>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-bg-deep/80 px-2 py-1 font-mono text-sm font-bold text-accent-primary">
                        {promo.code}
                      </code>
                      <button
                        onClick={(e) => handleCopy(e, promo)}
                        className="rounded p-1 text-text-muted transition-all hover:bg-accent-primary/10 hover:text-accent-primary"
                        title="Copy code"
                      >
                        {copiedId === promo.id ? (
                          <CheckCircleIcon className="h-4 w-4 text-accent-success" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Offer */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text-muted line-clamp-1 max-w-[200px]">
                      {promo.headline}
                    </span>
                  </td>

                  {/* Creator */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-accent-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-accent-primary">
                          {promo.video.creator.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-text-muted truncate max-w-[100px]">
                        {promo.video.creator.name}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    {promo.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-success/10 px-2 py-0.5 text-xs font-medium text-accent-success">
                        <CheckCircleIcon className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-text-muted/10 px-2 py-0.5 text-xs font-medium text-text-muted">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Link */}
                  <td className="px-4 py-3 text-center">
                    {promoLink ? (
                      <a
                        href={promoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="text-sm text-accent-primary underline underline-offset-2 transition-colors hover:text-accent-primary/80"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="text-sm text-text-muted/40">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
