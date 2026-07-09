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

export const metadata: Metadata = {
  title: "Jinyu Capital | Premium Industrial & Landscape Lighting",
  description: "High-performance explosion-proof lighting, architectural landscape illumination, and custom OEM/ODM manufacturing solutions. Certified to ISO 9001 and ATEX/EX standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
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
                <StoreSettingsProvider>
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
