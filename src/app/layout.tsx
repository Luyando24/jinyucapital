import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import { CartProvider } from "@/components/CartContext";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { StoreSettingsProvider } from "@/components/StoreSettingsContext";
import ServiceWorkerCleanup from "@/components/ServiceWorkerCleanup";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jinyu Capital | Premium Industrial & Landscape Lighting",
    template: "%s | Jinyu Capital",
  },
  description: "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions. Certified to ISO 9001 and ATEX/EX standards.",
  keywords: [
    "Jinyu Capital", 
    "explosion proof lighting", 
    "industrial lighting", 
    "landscape lighting", 
    "OEM lighting manufacturer", 
    "ODM lighting manufacturer", 
    "LED street lamps", 
    "commercial outdoor lighting", 
    "Guangzhou lighting manufacturer"
  ],
  openGraph: {
    title: "Jinyu Capital | Premium Industrial & Landscape Lighting",
    description: "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions.",
    url: SITE_URL,
    siteName: "Jinyu Capital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo2.png",
        width: 800,
        height: 800,
        alt: "Jinyu Capital Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jinyu Capital | Premium Industrial & Landscape Lighting",
    description: "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions.",
    images: ["/logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

async function getStoreSettings() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await client.from("store_settings").select("*").eq("id", 1).single();
    return data;
  } catch (error) {
    console.error("Failed to prefetch store settings:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await getStoreSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="E410Rnn60X0kVO4_2iYcE_roWP97VYcarNUeeUbmDkI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Jinyu Capital",
                  url: SITE_URL,
                  logo: `${SITE_URL}/logo2.png`,
                  description: "OEM/ODM manufacturer of industrial, landscape, and explosion-proof lighting solutions.",
                },
                { "@type": "WebSite", name: "Jinyu Capital", url: SITE_URL },
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`antialiased font-sans min-h-screen flex flex-col bg-white text-black`}
      >
        <ServiceWorkerCleanup />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <CurrencyProvider>
                <StoreSettingsProvider initialSettings={initialSettings}>
                  <Navbar />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                </StoreSettingsProvider>
              </CurrencyProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
