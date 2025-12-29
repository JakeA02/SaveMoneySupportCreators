import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://savemoneysupportcreators.com/about'),
  title: "About - Save Money Support Creators",
  description: "Learn about the mission and founder Jake Adler behind Save Money Support Creators.",
  openGraph: {
    title: "About - Save Money Support Creators",
    description: "Learn about the mission and founder Jake Adler behind Save Money Support Creators.",
    images: [
      {
        url: '/link-thumbnail.png', 
        width: 1400,         
        height: 900,         
        alt: 'SMSC Link Thumbnail',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
