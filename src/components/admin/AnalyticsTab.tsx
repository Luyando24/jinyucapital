"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  FileText,
  Building2,
  Users,
  Mail,
  Package,
  BarChart3,
  PieChart as PieIcon,
  Download,
  Clock,
  AlertTriangle,
  Activity,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  Inbox,
  Globe,
  Smartphone,
  Laptop,
  Compass,
  Link as LinkIcon,
  UserCheck,
  Eye,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

interface AnalyticsTabProps {
  orders: any[];
  products: any[];
  quoteRequests: any[];
  distributorApplications: any[];
  contactMessages: any[];
  subscribers: any[];
  pageViews?: any[];
  loading?: boolean;
}

type TimeFrame = "7d" | "30d" | "90d" | "ytd" | "all";

const DEVICE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AnalyticsTab({
  orders = [],
  products = [],
  quoteRequests = [],
  distributorApplications = [],
  contactMessages = [],
  subscribers = [],
  pageViews = [],
  loading = false,
}: AnalyticsTabProps) {
  const { language, t } = useAdminLanguage();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("30d");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // ── Time range calculation ───────────────────────────────────────────────
  const cutoffDate = useMemo(() => {
    const now = new Date();
    if (timeFrame === "7d") return new Date(now.setDate(now.getDate() - 7));
    if (timeFrame === "30d") return new Date(now.setDate(now.getDate() - 30));
    if (timeFrame === "90d") return new Date(now.setDate(now.getDate() - 90));
    if (timeFrame === "ytd") return new Date(now.getFullYear(), 0, 1);
    return new Date(0); // All time
  }, [timeFrame]);

  // ── Filtered Datasets ───────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = o.created_at ? new Date(o.created_at) : new Date();
      return d >= cutoffDate;
    });
  }, [orders, cutoffDate]);

  const filteredQuotes = useMemo(() => {
    return quoteRequests.filter((q) => {
      const d = q.created_at ? new Date(q.created_at) : new Date();
      return d >= cutoffDate;
    });
  }, [quoteRequests, cutoffDate]);

  const filteredDistributors = useMemo(() => {
    return distributorApplications.filter((d) => {
      const date = d.created_at ? new Date(d.created_at) : new Date();
      return date >= cutoffDate;
    });
  }, [distributorApplications, cutoffDate]);

  const filteredMessages = useMemo(() => {
    return contactMessages.filter((m) => {
      const d = m.created_at ? new Date(m.created_at) : new Date();
      return d >= cutoffDate;
    });
  }, [contactMessages, cutoffDate]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      const d = s.subscribed_at ? new Date(s.subscribed_at) : new Date();
      return d >= cutoffDate;
    });
  }, [subscribers, cutoffDate]);

  const filteredPageViews = useMemo(() => {
    return pageViews.filter((pv) => {
      const d = pv.created_at ? new Date(pv.created_at) : new Date();
      return d >= cutoffDate;
    });
  }, [pageViews, cutoffDate]);

  // ── Active Users Calculation (5m, 15m, 24h) ──────────────────────────────
  const activeUsers5m = useMemo(() => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const set = new Set<string>();
    pageViews.forEach((pv) => {
      const d = pv.created_at ? new Date(pv.created_at) : new Date();
      if (d >= fiveMinAgo && pv.session_id) set.add(pv.session_id);
    });
    return set.size;
  }, [pageViews]);

  const activeUsers15m = useMemo(() => {
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
    const set = new Set<string>();
    pageViews.forEach((pv) => {
      const d = pv.created_at ? new Date(pv.created_at) : new Date();
      if (d >= fifteenMinAgo && pv.session_id) set.add(pv.session_id);
    });
    return set.size;
  }, [pageViews]);

  const activeUsers24h = useMemo(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const set = new Set<string>();
    pageViews.forEach((pv) => {
      const d = pv.created_at ? new Date(pv.created_at) : new Date();
      if (d >= oneDayAgo && pv.session_id) set.add(pv.session_id);
    });
    return set.size;
  }, [pageViews]);

  // ── Traffic Sources & Referring Links ────────────────────────────────────
  const trafficSources = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPageViews.forEach((pv) => {
      let ref = pv.referrer || "Direct / None";
      if (!ref || ref === "" || ref.includes(window.location.hostname)) {
        ref = "Direct Navigation";
      } else if (ref.includes("google.")) {
        ref = "Google Search";
      } else if (ref.includes("bing.") || ref.includes("duckduckgo") || ref.includes("yahoo")) {
        ref = "Search Engines";
      } else if (
        ref.includes("linkedin.com") ||
        ref.includes("t.co") ||
        ref.includes("twitter.com") ||
        ref.includes("facebook.com") ||
        ref.includes("instagram.com")
      ) {
        ref = "Social Networks";
      } else if (ref.startsWith("http")) {
        try {
          const u = new URL(ref);
          ref = u.hostname;
        } catch (e) {}
      }
      map[ref] = (map[ref] || 0) + 1;
    });

    return Object.entries(map)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredPageViews]);

  // ── Country & Regional Distribution ───────────────────────────────────────
  const countryDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPageViews.forEach((pv) => {
      const c = pv.country && pv.country !== "Unknown" ? pv.country : "Direct Locale";
      map[c] = (map[c] || 0) + 1;
    });
    distributorApplications.forEach((d) => {
      if (d.country) {
        map[d.country] = (map[d.country] || 0) + 3; // Weight distributor apps
      }
    });

    return Object.entries(map)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredPageViews, distributorApplications]);

  // ── Device Type & Browser Breakdown ──────────────────────────────────────
  const deviceBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPageViews.forEach((pv) => {
      const dev = pv.device || "Desktop";
      map[dev] = (map[dev] || 0) + 1;
    });
    const result = Object.entries(map).map(([name, value]) => ({ name, value }));
    return result;
  }, [filteredPageViews]);

  const browserBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPageViews.forEach((pv) => {
      const b = pv.browser || "Other";
      map[b] = (map[b] || 0) + 1;
    });
    return Object.entries(map)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredPageViews]);

  // ── Top Visited Pages ────────────────────────────────────────────────────
  const topVisitedPages = useMemo(() => {
    const map: Record<string, number> = {};
    filteredPageViews.forEach((pv) => {
      const p = pv.path || "/";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredPageViews]);

  // ── Calculated Real E-Commerce Metrics ───────────────────────────────────
  const validOrders = useMemo(
    () => filteredOrders.filter((o) => o.status !== "Cancelled"),
    [filteredOrders]
  );

  const totalRevenue = useMemo(
    () => validOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
    [validOrders]
  );

  const avgOrderValue = useMemo(
    () => (validOrders.length > 0 ? totalRevenue / validOrders.length : 0),
    [validOrders, totalRevenue]
  );

  // Stock Metrics
  const lowStockProducts = useMemo(
    () => products.filter((p) => (p.stock_quantity ?? 0) < 5 && (p.stock_quantity ?? 0) > 0),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((p) => (p.stock_quantity ?? 0) <= 0),
    [products]
  );

  const totalCatalogValue = useMemo(
    () => products.reduce((sum, p) => sum + (Number(p.price) || 0) * (p.stock_quantity || 0), 0),
    [products]
  );

  // ── Revenue & Orders Trend Chart Data ────────────────────────────────────
  const trendData = useMemo(() => {
    const map: Record<string, { date: string; revenue: number; orders: number }> = {};

    const sorted = [...filteredOrders].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sorted.forEach((o) => {
      const d = o.created_at ? new Date(o.created_at) : new Date();
      const dateKey =
        timeFrame === "7d" || timeFrame === "30d"
          ? d.toLocaleDateString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" })
          : d.toLocaleDateString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { month: "short", year: "2-digit" });

      if (!map[dateKey]) {
        map[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
      }
      if (o.status !== "Cancelled") {
        map[dateKey].revenue += Number(o.total_amount) || 0;
      }
      map[dateKey].orders += 1;
    });

    return Object.values(map);
  }, [filteredOrders, language, timeFrame]);

  // ── Category Revenue Breakdown ───────────────────────────────────────────
  const categoryData = useMemo(() => {
    const map: Record<string, { category: string; revenue: number; items: number }> = {};

    filteredOrders.forEach((o) => {
      if (o.status === "Cancelled") return;
      if (o.order_items && Array.isArray(o.order_items)) {
        o.order_items.forEach((item: any) => {
          const cat = item.products?.category || "General Industrial";
          const itemRev = (Number(item.unit_price) || 0) * (item.quantity || 1);
          if (!map[cat]) map[cat] = { category: cat, revenue: 0, items: 0 };
          map[cat].revenue += itemRev;
          map[cat].items += item.quantity || 1;
        });
      }
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // ── Product Stock Performance Table ──────────────────────────────────────
  const categoryList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProductsList = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // ── Export Analytics Data to CSV ─────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = [t("Metric"), t("Value")];
    const rows = [
      [t("Timeframe"), timeFrame],
      [t("Active Users (5 min)"), activeUsers5m],
      [t("Active Users (15 min)"), activeUsers15m],
      [t("Active Users (24 hours)"), activeUsers24h],
      [t("Total Page Views"), filteredPageViews.length],
      [t("Total Revenue"), `$${totalRevenue.toFixed(2)}`],
      [t("Total Orders"), filteredOrders.length],
      [t("Valid/Paid Orders"), validOrders.length],
      [t("Average Order Value"), `$${avgOrderValue.toFixed(2)}`],
      [t("Total Products"), products.length],
      [t("Low Stock Alert Count"), lowStockProducts.length],
      [t("Out of Stock Count"), outOfStockProducts.length],
      [t("Quote Requests"), filteredQuotes.length],
      [t("Distributor Applications"), filteredDistributors.length],
      [t("Contact Messages"), filteredMessages.length],
      [t("Newsletter Subscribers"), filteredSubscribers.length],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-report-${timeFrame}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* ── Top Header Controls ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card border p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t("Real-Time Traffic & User Analytics")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("Active website visitors, referring traffic links, country locales, device types, and sales revenue.")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector tabs */}
          <div className="bg-muted p-1 rounded-xl flex items-center gap-1 border">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "90d", label: "90 Days" },
                { id: "ytd", label: "YTD" },
                { id: "all", label: "All Time" },
              ] as const
            ).map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFrame(tf.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeFrame === tf.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tf.label)}
              </button>
            ))}
          </div>

          <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2 rounded-xl border-slate-300">
            <Download className="h-4 w-4 text-primary" />
            {t("Export Report")}
          </Button>
        </div>
      </div>

      {/* ── ACTIVE USERS & REAL-TIME VISITOR METRICS ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Active Now (5 min) */}
        <div className="bg-emerald-950/5 border border-emerald-500/20 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              {t("Active Users Now")}
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-900 tracking-tight">{activeUsers5m}</div>
          <p className="text-xs text-emerald-700 mt-1">{t("Live visitors active in last 5 minutes")}</p>
        </div>

        {/* Active (15 min) */}
        <div className="bg-blue-950/5 border border-blue-500/20 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t("15-Min Active Visitors")}
            </span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-900 tracking-tight">{activeUsers15m}</div>
          <p className="text-xs text-blue-700 mt-1">{t("Unique session visitors in last 15 mins")}</p>
        </div>

        {/* Active 24 Hours */}
        <div className="bg-violet-950/5 border border-violet-500/20 p-5 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {t("24-Hour Active Users")}
            </span>
            <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
              <Monitor className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-violet-900 tracking-tight">{activeUsers24h}</div>
          <p className="text-xs text-violet-700 mt-1">{t("Unique user sessions recorded today")}</p>
        </div>
      </div>

      {/* ── TRAFFIC SOURCES & GEOGRAPHICAL LOCALE GRID ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referring Link / Traffic Channels */}
        <div className="bg-card border p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                {t("Traffic Sources & Referring Links")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Origins and acquisition links of website traffic")}
              </p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              {t("{count} Pageviews", { count: filteredPageViews.length })}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {trafficSources.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl text-xs">
                {t("No referral traffic recorded in this timeframe yet.")}
              </div>
            ) : (
              trafficSources.slice(0, 6).map((item) => {
                const pct = filteredPageViews.length > 0 ? ((item.count / filteredPageViews.length) * 100).toFixed(1) : 0;
                return (
                  <div key={item.source} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-[240px]">
                        {t(item.source)}
                      </span>
                      <span className="font-mono text-muted-foreground font-medium">
                        {t("{count} views ({percent}%)", { count: item.count, percent: pct })}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(Number(pct), 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Country & Geographical Distribution */}
        <div className="bg-card border p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                {t("Geographical Country Traffic")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Global visitor locations & B2B distributor regions")}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {countryDistribution.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl text-xs">
                {t("No location traffic data recorded in this timeframe yet.")}
              </div>
            ) : (
              countryDistribution.slice(0, 6).map((item) => {
                return (
                  <div key={item.country} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {item.country.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-xs text-foreground">{t(item.country)}</span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {t("{count} interactions", { count: item.count })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── DEVICE TYPES & TOP VISITED PAGES GRID ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device & Browser Distribution */}
        <div className="bg-card border p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Laptop className="h-5 w-5 text-primary" />
              {t("Device Types & Browsers")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("Desktop vs Mobile vs Tablet ratio")}
            </p>
          </div>

          <div className="h-[200px] w-full relative">
            {deviceBreakdown.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground text-xs space-y-1 border border-dashed rounded-xl bg-muted/20">
                <Smartphone className="h-8 w-8 text-muted-foreground/40" />
                <p className="font-semibold text-foreground">{t("No device data")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t text-xs">
            {deviceBreakdown.map((dev, idx) => (
              <div key={dev.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[idx % DEVICE_COLORS.length] }} />
                  <span className="font-medium text-muted-foreground">{t(dev.name)}</span>
                </div>
                <span className="font-bold">{dev.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Visited Pages List (2 Cols) */}
        <div className="lg:col-span-2 bg-card border p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                {t("Top Visited Pages & Content Traffic")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("Page URL paths with highest visitor traffic")}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">{t("Page URL Path")}</th>
                  <th className="p-3 text-right">{t("Page Views")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topVisitedPages.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                      {t("No page views recorded in this timeframe yet.")}
                    </td>
                  </tr>
                ) : (
                  topVisitedPages.slice(0, 7).map((item) => (
                    <tr key={item.path} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-medium text-foreground">{item.path}</td>
                      <td className="p-3 text-right font-bold text-primary">{t("{count} views", { count: item.count })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── E-COMMERCE & SALES PERFORMANCE SUMMARY ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-card border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("Total Sales Revenue")}
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">
            ${totalRevenue.toLocaleString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("Based on {count} paid orders", { count: validOrders.length })}
          </p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-card border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("Average Order Value")}
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">
            ${avgOrderValue.toLocaleString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("Per transaction average")}
          </p>
        </div>

        {/* B2B Inquiries */}
        <div className="bg-card border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("Quote & Partner Leads")}
            </span>
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">
            {t("{count} Inquiries", { count: filteredQuotes.length + filteredDistributors.length })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("{quotes} Quotes & {distributors} Distributor Apps", { quotes: filteredQuotes.length, distributors: filteredDistributors.length })}
          </p>
        </div>

        {/* Catalog Stock */}
        <div className="bg-card border p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("Catalog Products")}
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">
            {t("{count} Items", { count: products.length })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("Catalog Value: {value}", { value: `$${totalCatalogValue.toLocaleString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: 0 })}` })}
          </p>
        </div>
      </div>

      {/* ── Product Inventory Table ────────────────────────────────────── */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              {t("Product Inventory & Stock Status")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("Real-time inventory levels from the products database table")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> {t("Category:")}
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-background border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>
                  {t(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-semibold text-muted-foreground">
              <tr>
                <th className="p-4">{t("Product Name")}</th>
                <th className="p-4">{t("Category")}</th>
                <th className="p-4">{t("Unit Price")}</th>
                <th className="p-4">{t("Stock Quantity")}</th>
                <th className="p-4">{t("Catalog Valuation")}</th>
                <th className="p-4">{t("Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProductsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {t("No products found in database for the selected category.")}
                  </td>
                </tr>
              ) : (
                filteredProductsList.slice(0, 10).map((prod) => {
                  const qty = prod.stock_quantity ?? 0;
                  const price = Number(prod.price) || 0;
                  const val = qty * price;

                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> {t("In Stock")}
                    </span>
                  );

                  if (qty <= 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle className="h-3 w-3" /> {t("Out of Stock")}
                      </span>
                    );
                  } else if (qty < 5) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" /> {t("Low Stock ({count})", { count: qty })}
                      </span>
                    );
                  }

                  return (
                    <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{prod.name}</td>
                      <td className="p-4 text-muted-foreground">{t(prod.category || "General")}</td>
                      <td className="p-4 font-medium">${price.toFixed(2)}</td>
                      <td className="p-4 font-medium">{t("{count} units", { count: qty })}</td>
                      <td className="p-4 font-bold text-foreground">${val.toLocaleString(language === "zh" ? "zh-CN" : language === "ru" ? "ru-RU" : "en-US", { minimumFractionDigits: 2 })}</td>
                      <td className="p-4">{statusBadge}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredProductsList.length > 10 && (
          <div className="p-3 text-center bg-muted/20 border-t text-xs text-muted-foreground">
            {t("Showing top 10 of {count} products. Filter by category to view others.", { count: filteredProductsList.length })}
          </div>
        )}
      </div>
    </div>
  );
}
