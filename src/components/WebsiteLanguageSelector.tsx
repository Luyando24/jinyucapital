"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useWebsiteLanguage, WebsiteLanguage } from "@/components/WebsiteLanguageContext";

export default function WebsiteLanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage, t } = useWebsiteLanguage();

  return (
    <div className={`flex items-center gap-1.5 rounded-lg border bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/60 transition-colors ${className}`}>
      <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
      <label htmlFor="website-language-select" className="sr-only">{t("Language")}</label>
      <select
        id="website-language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as WebsiteLanguage)}
        className="bg-transparent text-xs font-medium outline-none cursor-pointer text-foreground"
        aria-label={t("Language")}
      >
        <option value="en" className="bg-background text-foreground">English</option>
        <option value="zh" className="bg-background text-foreground">中文</option>
        <option value="ru" className="bg-background text-foreground">Русский</option>
        <option value="fr" className="bg-background text-foreground">Français</option>
      </select>
    </div>
  );
}
