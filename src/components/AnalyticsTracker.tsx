"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function getDeviceType(ua: string): string {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowserName(ua: string): string {
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("SamsungBrowser")) return "Samsung Internet";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  if (ua.includes("Trident")) return "Internet Explorer";
  if (ua.includes("Edge") || ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Other";
}

function detectCountryFromTimezoneOrLocale(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("America/New_York") || tz.startsWith("America/Chicago") || tz.startsWith("America/Los_Angeles"))
      return "United States";
    if (tz.startsWith("America/Toronto") || tz.startsWith("America/Vancouver")) return "Canada";
    if (tz.startsWith("Europe/London")) return "United Kingdom";
    if (tz.startsWith("Europe/Berlin") || tz.startsWith("Europe/Munich")) return "Germany";
    if (tz.startsWith("Europe/Paris")) return "France";
    if (tz.startsWith("Asia/Shanghai") || tz.startsWith("Asia/Guangzhou") || tz.startsWith("Asia/Beijing")) return "China";
    if (tz.startsWith("Asia/Tokyo")) return "Japan";
    if (tz.startsWith("Asia/Dubai")) return "United Arab Emirates";
    if (tz.startsWith("Africa/Johannesburg")) return "South Africa";
    if (tz.startsWith("Australia/Sydney") || tz.startsWith("Australia/Melbourne")) return "Australia";
    if (tz.startsWith("America/Sao_Paulo")) return "Brazil";
    if (tz.startsWith("Asia/Singapore")) return "Singapore";
    
    const parts = tz.split("/");
    if (parts.length > 1) {
      return parts[1].replace(/_/g, " ");
    }
  } catch (e) {
    // Ignore error
  }
  return "Global / Unknown";
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Do not track admin path internals to keep visitor analytics clean
    if (pathname?.startsWith("/admin")) return;

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    // Get or generate session ID
    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem("jinyu_analytics_session") || "";
      if (!sessionId) {
        sessionId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        sessionStorage.setItem("jinyu_analytics_session", sessionId);
      }
    } catch (e) {
      sessionId = "sess_anon_" + Date.now();
    }

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const referrer = typeof document !== "undefined" ? document.referrer || "Direct / None" : "Direct / None";
    const device = getDeviceType(userAgent);
    const browser = getBrowserName(userAgent);
    const country = detectCountryFromTimezoneOrLocale();

    // Async pageview insert
    const recordPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          session_id: sessionId,
          path: fullPath,
          referrer: referrer,
          device: device,
          browser: browser,
          country: country,
        });
      } catch (err) {
        // Silent swallow
      }
    };

    recordPageView();
  }, [pathname, searchParams]);

  return null;
}
