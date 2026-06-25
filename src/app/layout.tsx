import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { SessionProvider } from "@/components/shared/SessionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingBall } from "@/components/shared/FloatingBall";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Top Legends - Tienda de Fútbol",
    template: "%s | Top Legends",
  },
  description: "Tu tienda especializada en productos de fútbol. Camisetas de clubes, selecciones nacionales, retro y uniformes completos.",
  icons: {
    icon: "/images/ui/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Top Legends",
    images: [{ url: "/images/ui/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white dark:bg-zinc-950">
        <SessionProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingBall />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
