"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPromoById } from "../../lib/mockData";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CopyIcon,
  YouTubeIcon,
  CalendarIcon,
  TagIcon,
  ExternalLinkIcon,
} from "../../components/Icons";

export default function PromoPage() {
  const params = useParams();
  const promoId = params.id as string;
  const promo = getPromoById(promoId);

  const [copied, setCopied] = useState(false);

  if (!promo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-deep px-6">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-text-primary">404</h1>
          <p className="mb-8 text-text-muted">Promo code not found</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-3 font-semibold text-bg-deep transition-all hover:bg-accent-primary/90"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promoLink = promo.link || promo.company.link;
  const youtubeVideoUrl = `https://youtube.com/watch?v=${promo.video.videoID}`;
  const youtubeThumbnail = `https://img.youtube.com/vi/${promo.video.videoID}/maxresdefault.jpg`;

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-deep/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-bg-surface text-text-muted transition-all hover:border-accent-primary/40 hover:text-accent-primary"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <Link href="/" className="shrink-0">
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                <span className="text-accent-primary">Save</span>
                <span className="text-accent-success">Support</span>
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Company Header */}
        <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="mb-4 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-4 sm:mb-0 sm:mr-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={promo.company.logoURL}
              alt={`${promo.company.name} logo`}
              className="h-full w-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `<span class="text-4xl font-bold text-text-primary">${promo.company.name.charAt(0)}</span>`;
              }}
            />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
                {promo.company.name}
              </h1>
              {promo.isVerified && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-success/10 px-3 py-1 text-sm font-medium text-accent-success">
                  <CheckCircleIcon className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>
            <p className="mb-3 text-lg text-text-muted">{promo.headline}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-muted sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface px-3 py-1 capitalize">
                <TagIcon className="h-3.5 w-3.5" />
                {promo.company.productType}
              </span>
              {promo.expiresAt && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-surface px-3 py-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Expires{" "}
                  {new Date(promo.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Promo Code Card */}
        <div className="mb-8 rounded-2xl border border-border-subtle bg-bg-surface p-6 sm:p-8">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-text-muted">
            Promo Code
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <code className="rounded-xl bg-bg-deep px-8 py-4 text-2xl font-bold tracking-widest text-accent-primary sm:text-3xl">
              {promo.code}
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
                Go to {promo.company.name}
              </a>
            </div>
          )}
        </div>

        {/* Source Video Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">
            Source Video
          </h2>
          <a
            href={youtubeVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all hover:border-accent-primary/30 hover:shadow-lg hover:shadow-accent-primary/10"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-bg-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnail}
                alt={promo.video.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to lower quality thumbnail
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${promo.video.videoID}/hqdefault.jpg`;
                }}
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg">
                  <YouTubeIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            {/* Video info */}
            <div className="p-4 sm:p-6">
              <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors group-hover:text-accent-primary">
                {promo.video.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <YouTubeIcon className="h-4 w-4 text-red-500" />
                <span>Watch on YouTube</span>
                <span className="text-text-muted/50">•</span>
                <span>
                  {new Date(promo.video.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* Creator Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">
            Creator
          </h2>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* Creator avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-success/20">
                <span className="text-3xl font-bold text-accent-primary">
                  {promo.video.creator.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="mb-1 text-xl font-semibold text-text-primary">
                  {promo.video.creator.name}
                </h3>
                <p className="mb-3 text-sm capitalize text-text-muted">
                  {promo.video.creator.genre} Creator
                </p>
                <a
                  href={promo.video.creator.profileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-red-500 transition-colors hover:text-red-400"
                >
                  <YouTubeIcon className="h-4 w-4" />
                  View Channel
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* See All Creator's Codes Button */}
        <div className="text-center">
          <Link
            href={`/search?q=${encodeURIComponent(promo.video.creator.name)}`}
            className="inline-flex items-center gap-3 rounded-xl border border-accent-primary/30 bg-accent-primary/10 px-8 py-4 font-semibold text-accent-primary transition-all hover:bg-accent-primary/20 hover:border-accent-primary/50"
          >
            <span>See all {promo.video.creator.name}&apos;s codes</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-surface/30">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-text-muted/50">
            Promo code sourced from YouTube video description. We are not affiliated with {promo.company.name}.
          </p>
        </div>
      </footer>
    </div>
  );
}

