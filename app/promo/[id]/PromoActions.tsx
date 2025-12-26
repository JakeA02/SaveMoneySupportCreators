"use client";

import { useState } from "react";
import {
  CheckCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
} from "../../components/Icons";

interface PromoActionsProps {
  code: string;
  companyName: string;
  promoLink: string | null;
}

export function PromoActions({ code, companyName, promoLink }: PromoActionsProps) {
  const [copied, setCopied] = useState(false);

  // Check if code is valid (not empty, null, space, "Not Provided", or "n/a")
  const hasValidCode = code && code.trim() !== "" && code.trim().toLowerCase() !== "not provided" && code.trim().toLowerCase() !== "n/a";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 rounded-2xl border border-border-subtle bg-bg-surface p-6 sm:p-8">
      {hasValidCode ? (
        <>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
            Promo Code
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <code className="rounded-xl bg-bg-deep px-8 py-4 text-2xl font-bold tracking-widest text-accent-primary sm:text-3xl">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-4 font-semibold transition-all ${
                copied
                  ? "bg-accent-success text-white"
                  : "bg-accent-primary text-bg-deep hover:bg-accent-primary/90"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-5 w-5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
          {promoLink && (
            <div className="text-center">
              <a
                href={promoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-primary underline underline-offset-4 transition-colors hover:text-accent-primary/80"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Go to {companyName}
              </a>
            </div>
          )}
        </>
      ) : promoLink ? (
        <>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
            Special Offer
          </p>
          <div className="flex justify-center">
            <a
              href={promoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-accent-primary px-8 py-4 text-xl font-semibold text-bg-deep transition-all hover:bg-accent-primary/90"
            >
              <ExternalLinkIcon className="h-5 w-5" />
              Go to Deal
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}

