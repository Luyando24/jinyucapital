"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ShowcaseProduct {
  title: string;
  description: string;
  image: string;
}

export interface HomepageStat {
  value: string;
  label: string;
}

export interface HomepageContent {
  hero_headline?: string;
  hero_subheadline?: string;
  stats?: HomepageStat[];
  manufacturing_headline?: string;
  manufacturing_body?: string;
  showcase_products?: ShowcaseProduct[];
}

export interface StoreSettings {
  id: number;
  store_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tiktok?: string;
  facebook?: string;
  instagram?: string;
  logo_url?: string;
  aud_rate?: number;
  ngn_rate?: number;
  global_wholesale_moq?: number;
  hero_image_url?: string;
  manufacturing_image_url?: string;
  homepage_content?: HomepageContent;
}

interface StoreSettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (!error && data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to fetch store settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error("useStoreSettings must be used within a StoreSettingsProvider");
  }
  return context;
}
