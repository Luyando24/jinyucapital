"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Globe, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebsiteLanguage } from "@/components/WebsiteLanguageContext";

interface HomeHeroCarouselProps {
  heroImages: string[];
  heroHeadline: string;
  heroSubheadline: string;
}

export default function HomeHeroCarousel({
  heroImages,
  heroHeadline,
  heroSubheadline,
}: HomeHeroCarouselProps) {
  const { t } = useWebsiteLanguage();
  const [activeHeroSlide, setActiveHeroSlide] = React.useState(0);
  const [heroPaused, setHeroPaused] = React.useState(false);
  const [heroInteractionPaused, setHeroInteractionPaused] = React.useState(false);

  React.useEffect(() => {
    if (activeHeroSlide >= heroImages.length) setActiveHeroSlide(0);
  }, [activeHeroSlide, heroImages.length]);

  React.useEffect(() => {
    if (heroImages.length <= 1 || heroPaused || heroInteractionPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % heroImages.length);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, heroImages.length, heroPaused, heroInteractionPaused]);

  const changeHeroSlide = (direction: -1 | 1) => {
    setActiveHeroSlide(
      (current) => (current + direction + heroImages.length) % heroImages.length
    );
  };

  return (
    <section
      className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-zinc-950"
      role="region"
      aria-roledescription="carousel"
      aria-label="Jinyu Capital highlights"
      onMouseEnter={() => setHeroInteractionPaused(true)}
      onMouseLeave={() => setHeroInteractionPaused(false)}
      onFocus={() => setHeroInteractionPaused(true)}
      onBlur={() => setHeroInteractionPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") changeHeroSlide(-1);
        if (event.key === "ArrowRight") changeHeroSlide(1);
      }}
    >
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        {heroImages.length ? (
          heroImages.map((image, index) => (
            <motion.div
              key={image}
              initial={false}
              animate={{
                opacity: index === activeHeroSlide ? 1 : 0,
                scale: index === activeHeroSlide ? 1 : 1.025,
              }}
              transition={{
                opacity: { duration: 1.1, ease: "easeInOut" },
                scale: { duration: 7, ease: "linear" },
              }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900" />
        )}
      </div>
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/60 to-black/75"
        aria-hidden="true"
      />

      <div className="section-container py-28 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight mb-8"
            style={{ letterSpacing: "-0.03em", textWrap: "balance" }}
          >
            {heroHeadline}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 text-white/90">
            {heroSubheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            <Button asChild size="lg" className="text-base px-8 h-12">
              <Link href="/products" className="flex items-center">
                {t("Explore products")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 h-12"
            >
              <Link href="/request-quote">{t("Request a quote")}</Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-white/20 max-w-md mx-auto">
            <p className="text-sm text-white/70 mb-3">
              {t("Looking to expand your business?")}
            </p>
            <Link
              href="/distributor"
              className="inline-flex items-center text-white hover:text-primary transition-colors font-semibold text-lg"
            >
              <Globe className="w-5 h-5 mr-2.5" />
              {t("Become a Distributor")}
            </Link>
          </div>
        </motion.div>
      </div>

      {heroImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-2 py-2 text-white shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => changeHeroSlide(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Show previous hero image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            className="flex items-center gap-1.5"
            role="group"
            aria-label="Choose hero image"
          >
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-current={index === activeHeroSlide ? "true" : undefined}
                aria-label={`Show hero image ${index + 1}`}
                onClick={() => setActiveHeroSlide(index)}
                className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  index === activeHeroSlide
                    ? "w-7 bg-white"
                    : "w-2 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setHeroPaused((paused) => !paused)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={
              heroPaused
                ? "Resume automatic hero rotation"
                : "Pause automatic hero rotation"
            }
          >
            {heroPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => changeHeroSlide(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Show next hero image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Hero image {activeHeroSlide + 1} of {heroImages.length}
      </p>
    </section>
  );
}
