import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About - Save Money Support Creators",
  description:
    "Learn about the mission and founder Jake Adler behind Save Money Support Creators.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-deep">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-success/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent-primary"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-8">
        {/* Page Title */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            About
          </h1>
          <div className="mx-auto h-1 w-16 rounded-full bg-linear-to-r from-accent-primary to-accent-success" />
        </div>

        {/* Mission Section */}
        <section className="mb-16 animate-fade-in-up-delay-1">
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">
            Why SaveMoneySupportCreators.com Exists
          </h2>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface/50 p-6 backdrop-blur-sm sm:p-8">
            <p className="leading-relaxed text-text-muted">
              SaveMoneySupportCreators.com (SMSC) was created to centralize the
              discount codes scattered across YouTube, ensuring you can save
              money while directly benefiting creators—no subscription required.
              Driven by a desire to protect creator revenue from unfair
              third-party practices, SMSC empowers the community by making
              affiliate codes easy to find and use. Our platform is, and always
              will be, free to use.
            </p>
          </div>
        </section>

        {/* About Me Section */}
        <section className="mb-16 animate-fade-in-up-delay-2">
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">
            Who I Am
          </h2>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface/50 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* Photo */}
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
                <Image
                  src="/profile.png"
                  alt="Jake Adler"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bio */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="mb-3 text-xl font-semibold text-text-primary">
                  Jake Adler
                </h3>
                <p className="leading-relaxed text-text-muted">
                  I am a software engineer and entrepreneur based in NYC, and a
                  recent graduate of the University of Virginia (Class of 2025).
                  I'm driven by the "build" phase of software, such as creating
                  side projects like SMSC that solve real-world problems.
                  Currently, I'm exploring the evolving AI landscape and
                  searching for my next big venture. I'm always open to new
                  ideas and connections, so feel free to reach out if you'd like
                  to chat!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="animate-fade-in-up-delay-3">
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">
            Get in Touch
          </h2>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface/50 p-6 backdrop-blur-sm sm:p-8">
            <p className="mb-6 text-text-muted">
              Have questions, feedback, or just want to say hi? Feel free to
              reach out.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:jakeadler02@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-6 py-3 font-semibold text-bg-deep transition-all duration-200 hover:bg-accent-primary/90 hover:shadow-lg hover:shadow-accent-primary/25 active:scale-95"
              >
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                jakeadler02@gmail.com
              </a>
              <a
                href="https://x.com/thejakeadler"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-6 py-3 font-semibold text-text-primary transition-all duration-200 hover:border-text-primary/40 hover:bg-bg-surface/80 active:scale-95"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @thejakeadler
              </a>
              <a
                href="https://linkedin.com/in/adlerjake"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-6 py-3 font-semibold text-text-primary transition-all duration-200 hover:border-[#0A66C2]/60 hover:bg-bg-surface/80 active:scale-95"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                @adler-jake
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center">
        <Link
          href="/"
          className="text-xs text-text-muted/50 transition-colors hover:text-text-muted"
        >
          © {new Date().getFullYear()} Save Money Support Creators
        </Link>
      </footer>
    </div>
  );
}
