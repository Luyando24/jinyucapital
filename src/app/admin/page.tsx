"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Search, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  Loader2, 
  Save, 
  LogOut, 
  Globe, 
  Lock,
  ChevronDown,
  ChevronUp,
  Pencil,
  Upload,
  Menu,
  X,
  Settings,
  Mail,
  Send,
  Download,
  Users,
  FileText,
  Building2,
  Phone,
  Image as ImageIcon,
  Monitor,
  Star,
  DollarSign,
  BarChart3,
  Link as LinkIcon,
  RefreshCcw,
  Check
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type HomepageContent, type HomepageStat, type ShowcaseProduct } from "@/components/StoreSettingsContext";

type AdminTab = "overview" | "products" | "orders" | "quotes" | "distributors" | "contacts" | "newsletter" | "website" | "settings";

const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero_headline: "Manufacturing Excellence From China To The World",
  hero_subheadline: "Jinyu combines manufacturing, OEM production, product development, and global supply chain solutions for distributors, wholesalers, contractors, and brands worldwide.",
  stats: [
    { value: "150+", label: "Product lines" },
    { value: "10k", label: "Sq.m facility" },
    { value: "50+", label: "Countries exported" },
    { value: "ISO", label: "9001 Certified" },
  ],
  manufacturing_headline: "Manufacturing excellence",
  manufacturing_body: "Built on a foundation of engineering expertise, we deliver reliable products that meet the demands of global markets. Our Guangzhou facility represents the pinnacle of modern production capabilities.",
  showcase_products: [
    { title: "Skyline Boulevard Series", description: "Designed for modern cities, business districts, residential communities, and municipal infrastructure projects, the Skyline Boulevard Series combines contemporary aesthetics with exceptional lighting performance.", image: "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/2d2f38454b0a51de12a8d25ef8865e29.png" },
    { title: "Urban Road Lighting Series", description: "Reliable LED street lighting for urban roads, parks, estates, and commercial projects. Designed for strong illumination, energy efficiency, and long service life.", image: "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/202c6c4ad9decc793555fc90c89a010b.png" },
    { title: "Metro Avenue Series", description: "Modern LED street lighting for highways, city roads, business parks, and residential developments. Built for efficient illumination, durability, and long-lasting outdoor performance.", image: "https://horizons-cdn.hostinger.com/b89183a0-b6a3-4e5f-9421-7ba71104641c/37662bcfd9d866fc2b36dd3037f09255.png" },
  ],
};

// ── Small helper components ──────────────────────────────────────────────────

function StatCard({ icon, iconBg, label, value, sub }: { icon: React.ReactNode; iconBg: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
      <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{children}</label>;
}

function SaveBanner({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 ${saving || saved ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"} ${saved ? "bg-green-50 border-green-200 text-green-700" : "bg-background border text-foreground"}`}>
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      {saving ? "Saving…" : "Saved!"}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [distributorApplications, setDistributorApplications] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Save state
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [savingWebsite, setSavingWebsite] = useState(false);
  const [savedWebsite, setSavedWebsite] = useState(false);

  // Logo upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  // Hero image upload
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const [mfgFile, setMfgFile] = useState<File | null>(null);
  const [mfgPreview, setMfgPreview] = useState<string>("");

  // Homepage content local state
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [mfgImageUrl, setMfgImageUrl] = useState("");

  // Search & filter
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [stockEditValues, setStockEditValues] = useState<Record<string, number>>({});

  // Newsletter
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Quote editing
  const [editingQuote, setEditingQuote] = useState<string | null>(null);
  const [quoteEditData, setQuoteEditData] = useState<any>(null);

  // ── Data loading ─────────────────────────────────────────────────────────

  const loadAdminDataset = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        { data: prodData, error: prodErr },
        { data: ordData, error: ordErr },
        { data: settingsData },
        { data: subData },
        { data: quotesData },
        { data: distData },
        { data: contactData },
      ] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("orders").select("*, order_items(*, products(*))").order("created_at", { ascending: false }),
        supabase.from("store_settings").select("*").eq("id", 1).single(),
        supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
        supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("distributor_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (prodErr) throw prodErr;
      if (ordErr) throw ordErr;

      setProducts(prodData || []);
      const buf: Record<string, number> = {};
      (prodData || []).forEach((p: any) => { buf[p.id] = p.stock_quantity ?? 0; });
      setStockEditValues(buf);

      setOrders(ordData || []);
      setSubscribers(subData || []);
      setQuoteRequests(quotesData || []);
      setDistributorApplications(distData || []);
      setContactMessages(contactData || []);

      if (settingsData) {
        setStoreSettings(settingsData);
        if (settingsData.logo_url) setLogoPreview(settingsData.logo_url);
        if (settingsData.hero_image_url) { setHeroImageUrl(settingsData.hero_image_url); setHeroPreview(settingsData.hero_image_url); }
        if (settingsData.manufacturing_image_url) { setMfgImageUrl(settingsData.manufacturing_image_url); setMfgPreview(settingsData.manufacturing_image_url); }
        if (settingsData.homepage_content && Object.keys(settingsData.homepage_content).length > 0) {
          setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...settingsData.homepage_content });
        }
      }
    } catch (err: any) {
      console.error("Dashboard fetch failed:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (!isAdmin) { router.push("/"); return; }
      loadAdminDataset();
    }
  }, [user, isAdmin]);

  // ── File upload helper ───────────────────────────────────────────────────

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Products ─────────────────────────────────────────────────────────────

  const handleSaveStock = async (productId: string) => {
    const val = stockEditValues[productId];
    if (val === undefined || val < 0) return;
    const { error } = await supabase.from("products").update({ stock_quantity: val }).eq("id", productId);
    if (error) { alert("Stock update failed: " + error.message); return; }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: val } : p));
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert("Delete failed: " + error.message); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ── Orders ───────────────────────────────────────────────────────────────

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) { alert("Update failed: " + error.message); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) { alert("Delete failed: " + error.message); return; }
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // ── Newsletter ───────────────────────────────────────────────────────────

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Remove subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) { alert("Failed: " + error.message); return; }
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const handleExportCSV = () => {
    const csv = ["Email,Subscribed At", ...subscribers.filter(s => s.is_active).map(s => `${s.email},${s.subscribed_at}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "jinyu_subscribers.csv";
    a.click();
  };

  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = subscribers.filter(s => s.is_active).map(s => s.email);
    if (!emails.length) { alert("No active subscribers."); return; }
    window.open(`mailto:?bcc=${emails.join(",")}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, "_blank");
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberEmail.includes("@")) { alert("Enter a valid email."); return; }
    setAddingSubscriber(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: newSubscriberEmail, is_active: true });
    setAddingSubscriber(false);
    if (error) { alert("Failed: " + error.message); return; }
    setNewSubscriberEmail("");
    loadAdminDataset();
  };

  // ── Quotes ───────────────────────────────────────────────────────────────

  const handleUpdateQuoteStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) { alert("Failed."); return; }
    setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Delete quote?")) return;
    await supabase.from("quote_requests").delete().eq("id", id);
    setQuoteRequests(prev => prev.filter(q => q.id !== id));
  };

  const handleSaveQuoteEdit = async () => {
    if (!editingQuote || !quoteEditData) return;
    const { error } = await supabase.from("quote_requests").update({ status: quoteEditData.status, message: quoteEditData.message, quantity: quoteEditData.quantity, product_interest: quoteEditData.product_interest }).eq("id", editingQuote);
    if (error) { alert("Failed: " + error.message); return; }
    setQuoteRequests(prev => prev.map(q => q.id === editingQuote ? { ...q, ...quoteEditData } : q));
    setEditingQuote(null);
    setQuoteEditData(null);
  };

  // ── Distributors ─────────────────────────────────────────────────────────

  const handleUpdateDistributorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("distributor_applications").update({ status }).eq("id", id);
    if (error) { alert("Failed."); return; }
    setDistributorApplications(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleDeleteDistributor = async (id: string) => {
    if (!confirm("Delete distributor application?")) return;
    await supabase.from("distributor_applications").delete().eq("id", id);
    setDistributorApplications(prev => prev.filter(d => d.id !== id));
  };

  // ── Contacts ─────────────────────────────────────────────────────────────

  const handleUpdateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) { alert("Failed."); return; }
    setContactMessages(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Delete message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setContactMessages(prev => prev.filter(c => c.id !== id));
  };

  // ── Settings save ────────────────────────────────────────────────────────

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingSettings) return;
    setSavingSettings(true);
    try {
      let logoUrl = storeSettings?.logo_url || "";
      if (logoFile) {
        logoUrl = await uploadFile(logoFile, "store");
      }
      const { error } = await supabase.from("store_settings").upsert({
        ...storeSettings,
        logo_url: logoUrl,
        id: 1,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setStoreSettings((prev: any) => ({ ...prev, logo_url: logoUrl }));
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 2500);
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Website content save ─────────────────────────────────────────────────

  const handleSaveWebsiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingWebsite) return;
    setSavingWebsite(true);
    try {
      let finalHeroUrl = heroImageUrl;
      let finalMfgUrl = mfgImageUrl;

      if (heroFile) finalHeroUrl = await uploadFile(heroFile, "homepage");
      if (mfgFile) finalMfgUrl = await uploadFile(mfgFile, "homepage");

      const { error } = await supabase.from("store_settings").upsert({
        id: 1,
        hero_image_url: finalHeroUrl,
        manufacturing_image_url: finalMfgUrl,
        homepage_content: homepageContent,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setHeroImageUrl(finalHeroUrl);
      setMfgImageUrl(finalMfgUrl);
      if (finalHeroUrl) setHeroPreview(finalHeroUrl);
      if (finalMfgUrl) setMfgPreview(finalMfgUrl);
      setSavedWebsite(true);
      setTimeout(() => setSavedWebsite(false), 2500);
    } catch (err: any) {
      alert("Error saving website content: " + err.message);
    } finally {
      setSavingWebsite(false);
    }
  };

  // ── Auth guard ───────────────────────────────────────────────────────────

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="max-w-md w-full bg-background p-8 rounded-2xl shadow-xl border text-center space-y-6">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <Lock className="text-primary h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Admin Portal</h2>
        <p className="text-muted-foreground">Please sign in to access the management dashboard.</p>
        <Button asChild className="w-full">
          <Link href="/login?redirect=/admin">Sign In</Link>
        </Button>
      </div>
    </div>
  );

  // ── Derived values ───────────────────────────────────────────────────────

  const totalRevenue = orders.reduce((s, o) => s + (o.status !== "Cancelled" ? Number(o.total_amount) : 0), 0);
  const lowStockCount = products.filter(p => (p.stock_quantity ?? 0) < 5).length;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const q = orderSearch.toLowerCase();
    const matchSearch = o.first_name?.toLowerCase().includes(q) || o.last_name?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "quotes", label: "Quotes", icon: FileText, badge: quoteRequests.filter(q => q.status === "new").length },
    { id: "distributors", label: "Distributors", icon: Building2, badge: distributorApplications.filter(d => d.status === "new").length },
    { id: "contacts", label: "Messages", icon: MessageSquare, badge: contactMessages.filter(c => c.status === "unread").length },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "website", label: "Website Content", icon: Monitor },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // ── Status badge helper ──────────────────────────────────────────────────

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Shipped: "bg-green-50 text-green-700 border-green-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
      Processing: "bg-blue-50 text-blue-700 border-blue-200",
      Cancelled: "bg-red-50 text-red-700 border-red-200",
      new: "bg-blue-50 text-blue-700 border-blue-200",
      quoted: "bg-green-50 text-green-700 border-green-200",
      closed: "bg-gray-50 text-gray-700 border-gray-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      unread: "bg-primary/10 text-primary border-primary/20",
      read: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${map[status] || "bg-gray-50 text-gray-700 border-gray-200"}`;
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">ADMIN</span>
            <button className="ml-auto md:hidden p-1 hover:bg-muted rounded" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as AdminTab); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                {(item as any).badge ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-white text-primary" : "bg-primary text-white"}`}>
                    {(item as any).badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user.email?.split("@")[0]}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => { signOut(); router.push("/"); }}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold capitalize">{activeTab === "website" ? "Website Content" : activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={loadAdminDataset} title="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Link href="/" target="_blank">
                <Globe className="h-4 w-4" />
                View Site
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <p className="text-muted-foreground text-sm">Loading data…</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">

              {/* ── OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      icon={<TrendingUp className="h-5 w-5 text-primary" />}
                      iconBg="bg-primary/10"
                      label="Total Revenue"
                      value={`$${totalRevenue.toLocaleString()}`}
                      sub={`from ${orders.filter(o => o.status !== "Cancelled").length} orders`}
                    />
                    <StatCard
                      icon={<ShoppingBag className="h-5 w-5 text-amber-600" />}
                      iconBg="bg-amber-500/10"
                      label="Total Orders"
                      value={orders.length}
                      sub={`${orders.filter(o => o.status === "Pending").length} pending`}
                    />
                    <StatCard
                      icon={<Package className="h-5 w-5 text-blue-600" />}
                      iconBg="bg-blue-500/10"
                      label="Products"
                      value={products.length}
                      sub={`${products.filter(p => (p.stock_quantity ?? 0) > 0).length} in stock`}
                    />
                    <StatCard
                      icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                      iconBg="bg-red-500/10"
                      label="Low Stock"
                      value={lowStockCount}
                      sub="items below 5 units"
                    />
                  </div>

                  {/* Quick stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "New Quotes", value: quoteRequests.filter(q => q.status === "new").length, color: "text-blue-600" },
                      { label: "Distributor Apps", value: distributorApplications.filter(d => d.status === "new").length, color: "text-purple-600" },
                      { label: "Unread Messages", value: contactMessages.filter(c => c.status === "unread").length, color: "text-orange-600" },
                      { label: "Subscribers", value: subscribers.filter(s => s.is_active).length, color: "text-green-600" },
                    ].map(item => (
                      <div key={item.label} className="bg-card border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent orders */}
                  <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b flex items-center justify-between">
                      <h3 className="font-bold">Recent Orders</h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>View All</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Customer</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Date</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Amount</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {orders.slice(0, 6).map(o => (
                            <tr key={o.id} className="hover:bg-muted/30">
                              <td className="px-6 py-4">
                                <p className="font-bold">{o.first_name} {o.last_name}</p>
                                <p className="text-xs text-muted-foreground">{o.email}</p>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-bold">${Number(o.total_amount).toLocaleString()}</td>
                              <td className="px-6 py-4"><span className={statusBadge(o.status)}>{o.status}</span></td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-sm">No orders yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRODUCTS ── */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search products…" className="pl-10" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                    </div>
                    <Button asChild>
                      <Link href="/admin/products/new"><Plus className="h-4 w-4 mr-2" />Add Product</Link>
                    </Button>
                  </div>

                  <div className="bg-card border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Product</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Category</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Price</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Stock</th>
                          <th className="px-6 py-4 text-center font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-muted/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-2 text-muted-foreground" />}
                                </div>
                                <div>
                                  <p className="font-bold">{p.name}</p>
                                  {p.is_wholesale && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">Wholesale</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                            <td className="px-6 py-4">
                              <p className="font-bold">${p.price}</p>
                              {p.is_wholesale && <p className="text-[10px] text-muted-foreground">MOQ ${p.moq_price} × {p.moq_quantity}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={stockEditValues[p.id] ?? p.stock_quantity}
                                  onChange={e => setStockEditValues({ ...stockEditValues, [p.id]: parseInt(e.target.value) })}
                                  className={`w-16 h-8 rounded border px-2 text-xs ${(stockEditValues[p.id] ?? p.stock_quantity) < 5 ? "border-red-300 bg-red-50" : ""}`}
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSaveStock(p.id)}>
                                  <Save className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex justify-center gap-2">
                                <Button asChild variant="ghost" size="icon">
                                  <Link href={`/admin/products/edit/${p.id}`}><Pencil className="h-4 w-4" /></Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProduct(p.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">No products found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── ORDERS ── */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search orders…" className="pl-10" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {["All", "Pending", "Processing", "Shipped", "Cancelled"].map(s => (
                        <Button key={s} variant={orderStatusFilter === s ? "default" : "outline"} size="sm" onClick={() => setOrderStatusFilter(s)}>{s}</Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="w-10 px-4" />
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">ID</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Customer</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Amount</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-center font-medium text-muted-foreground">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredOrders.map(o => (
                          <React.Fragment key={o.id}>
                            <tr className="hover:bg-muted/30">
                              <td className="px-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}>
                                  {expandedOrderId === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{o.id.substring(0, 8)}</td>
                              <td className="px-6 py-4">
                                <p className="font-bold">{o.first_name} {o.last_name}</p>
                                <p className="text-xs text-muted-foreground">{o.email}</p>
                              </td>
                              <td className="px-6 py-4 font-bold">${Number(o.total_amount).toLocaleString()}</td>
                              <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <select value={o.status} onChange={e => handleUpdateStatus(o.id, e.target.value)} className="bg-background border rounded px-2 py-1 text-xs font-bold outline-none">
                                  {["Pending","Processing","Shipped","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteOrder(o.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                            {expandedOrderId === o.id && (
                              <tr className="bg-muted/20">
                                <td colSpan={7} className="p-6">
                                  <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipping Details</h4>
                                      <div className="space-y-1 text-sm">
                                        <p className="font-medium">{o.first_name} {o.last_name}</p>
                                        <p className="text-muted-foreground">{o.address}</p>
                                        <p className="text-muted-foreground">{o.city}, {o.postal_code}</p>
                                        {o.phone && <p className="text-muted-foreground">{o.phone}</p>}
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items Ordered</h4>
                                      <div className="space-y-2">
                                        {o.order_items?.map((item: any) => (
                                          <div key={item.id} className="flex justify-between items-center text-sm bg-background p-2 rounded-lg">
                                            <span>{item.products?.name || "Unknown"} × {item.quantity}</span>
                                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">No orders found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── QUOTES ── */}
              {activeTab === "quotes" && (
                <div className="space-y-4">
                  {quoteRequests.map(q => (
                    <div key={q.id} className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold">{q.first_name} {q.last_name}</p>
                              <span className="text-muted-foreground">·</span>
                              <p className="text-muted-foreground text-sm">{q.company_name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{q.email} {q.phone && `· ${q.phone}`}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(q.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className={statusBadge(q.status)}>{q.status}</span>
                            {editingQuote === q.id ? (
                              <>
                                <Button variant="outline" size="sm" onClick={() => { setEditingQuote(null); setQuoteEditData(null); }}>Cancel</Button>
                                <Button size="sm" onClick={handleSaveQuoteEdit}>Save</Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => { setEditingQuote(q.id); setQuoteEditData({ ...q }); }}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteQuote(q.id)}><Trash2 className="h-4 w-4" /></Button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingQuote === q.id ? (
                          <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <SectionLabel>Status</SectionLabel>
                                <select value={quoteEditData.status} onChange={e => setQuoteEditData({ ...quoteEditData, status: e.target.value })} className="w-full bg-background border rounded px-3 py-2 text-xs font-bold">
                                  <option value="new">New</option>
                                  <option value="quoted">Quoted</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </div>
                              <div>
                                <SectionLabel>Quantity</SectionLabel>
                                <input type="number" value={quoteEditData.quantity} onChange={e => setQuoteEditData({ ...quoteEditData, quantity: parseInt(e.target.value) })} className="w-full bg-background border rounded px-3 py-2 text-xs font-bold" />
                              </div>
                              <div>
                                <SectionLabel>Product Interest</SectionLabel>
                                <input type="text" value={quoteEditData.product_interest || ""} onChange={e => setQuoteEditData({ ...quoteEditData, product_interest: e.target.value })} className="w-full bg-background border rounded px-3 py-2 text-xs font-bold" />
                              </div>
                            </div>
                            <div>
                              <SectionLabel>Message</SectionLabel>
                              <textarea rows={3} value={quoteEditData.message || ""} onChange={e => setQuoteEditData({ ...quoteEditData, message: e.target.value })} className="w-full bg-background border rounded px-3 py-2 text-xs resize-none" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              {[
                                { label: "Product", value: q.product_interest || "N/A" },
                                { label: "Quantity", value: q.quantity || "N/A" },
                                { label: "Project Type", value: q.project_type || "N/A" },
                                { label: "Phone", value: q.phone || "N/A" },
                              ].map(item => (
                                <div key={item.label} className="bg-muted/50 p-3 rounded-xl">
                                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{item.label}</p>
                                  <p className="font-medium">{item.value}</p>
                                </div>
                              ))}
                            </div>
                            {q.message && (
                              <div className="p-4 bg-primary/5 border-l-4 border-primary text-sm rounded-r-xl">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Message</p>
                                <p>{q.message}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {quoteRequests.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-medium">No quote requests yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── DISTRIBUTORS ── */}
              {activeTab === "distributors" && (
                <div className="space-y-4">
                  {distributorApplications.map(d => (
                    <div key={d.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold">{d.contact_name} · <span className="text-muted-foreground font-normal">{d.company_name}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">{d.email} · {d.country} · {d.business_type}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(d.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <select value={d.status} onChange={e => handleUpdateDistributorStatus(d.id, e.target.value)} className="bg-background border rounded px-2 py-1 text-xs font-bold">
                            <option value="new">New</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteDistributor(d.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        {[
                          { label: "Phone", value: d.phone || "N/A" },
                          { label: "Experience", value: d.experience || "N/A" },
                          { label: "Products Interest", value: d.products || "N/A" },
                        ].map(item => (
                          <div key={item.label} className="bg-muted/50 p-3 rounded-xl">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{item.label}</p>
                            <p className="font-medium">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {d.message && <div className="bg-muted/50 p-4 rounded-xl text-sm leading-relaxed">{d.message}</div>}
                    </div>
                  ))}
                  {distributorApplications.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-medium">No distributor applications yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── CONTACTS ── */}
              {activeTab === "contacts" && (
                <div className="space-y-4">
                  {contactMessages.map(c => (
                    <div key={c.id} className={`bg-card border rounded-2xl p-6 shadow-sm space-y-4 ${c.status === "unread" ? "border-primary" : ""}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">{c.name}</p>
                            {c.status === "unread" && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">NEW</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(c.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <select value={c.status} onChange={e => handleUpdateContactStatus(c.id, e.target.value)} className="bg-background border rounded px-2 py-1 text-xs font-bold">
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                          </select>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteContact(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-xl text-sm leading-relaxed">{c.message}</div>
                    </div>
                  ))}
                  {contactMessages.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-medium">No messages yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── NEWSLETTER ── */}
              {activeTab === "newsletter" && (
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">Subscribers</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{subscribers.filter(s => s.is_active).length} active</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                        <Download className="h-4 w-4" />Export CSV
                      </Button>
                    </div>
                    <form onSubmit={handleAddSubscriber} className="flex gap-2">
                      <Input placeholder="Add subscriber email…" value={newSubscriberEmail} onChange={e => setNewSubscriberEmail(e.target.value)} className="flex-1" />
                      <Button type="submit" disabled={addingSubscriber}>
                        {addingSubscriber ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </form>
                    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-4 text-left font-medium text-muted-foreground">Email</th>
                            <th className="px-6 py-4 text-left font-medium text-muted-foreground">Subscribed</th>
                            <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-6 py-4 text-center text-muted-foreground">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {subscribers.map(s => (
                            <tr key={s.id} className="hover:bg-muted/30">
                              <td className="px-6 py-4">{s.email}</td>
                              <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                                  {s.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSubscriber(s.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {subscribers.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground text-sm">No subscribers yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold">Broadcast Email</h3>
                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="space-y-2">
                        <SectionLabel>Subject</SectionLabel>
                        <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Newsletter Subject" />
                      </div>
                      <div className="space-y-2">
                        <SectionLabel>Message Body</SectionLabel>
                        <textarea rows={10} value={emailBody} onChange={e => setEmailBody(e.target.value)} className="w-full bg-background border rounded-xl p-3 text-sm resize-none" placeholder="Email body content…" />
                      </div>
                      <Button className="w-full gap-2" onClick={handleSendNewsletter}>
                        <Send className="h-4 w-4" />Send via Email Client
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">Opens your default email client with BCC to all active subscribers.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── WEBSITE CONTENT ── */}
              {activeTab === "website" && (
                <form onSubmit={handleSaveWebsiteContent} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-lg">Website Content</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Edit what visitors see on the homepage.</p>
                    </div>
                    <Button type="submit" disabled={savingWebsite} className="gap-2">
                      {savingWebsite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save All Changes
                    </Button>
                  </div>

                  {/* Hero Section */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4 flex items-center gap-2"><Star className="h-4 w-4 text-primary" />Hero Section</h3>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <SectionLabel>Hero Headline</SectionLabel>
                          <textarea
                            rows={2}
                            value={homepageContent.hero_headline || ""}
                            onChange={e => setHomepageContent({ ...homepageContent, hero_headline: e.target.value })}
                            className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Hero Sub-headline</SectionLabel>
                          <textarea
                            rows={4}
                            value={homepageContent.hero_subheadline || ""}
                            onChange={e => setHomepageContent({ ...homepageContent, hero_subheadline: e.target.value })}
                            className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Hero Image URL</SectionLabel>
                          <Input
                            value={heroImageUrl}
                            onChange={e => { setHeroImageUrl(e.target.value); setHeroPreview(e.target.value); }}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Or Upload New Hero Image</SectionLabel>
                          <label className="flex items-center gap-2 cursor-pointer border rounded-xl p-3 hover:bg-muted/50 transition-colors">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{heroFile ? heroFile.name : "Click to upload image…"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setHeroFile(e.target.files[0]); setHeroPreview(URL.createObjectURL(e.target.files[0])); } }} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <SectionLabel>Preview</SectionLabel>
                        <div className="aspect-video rounded-xl overflow-hidden border bg-muted relative">
                          {heroPreview ? (
                            <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <ImageIcon className="h-8 w-8 opacity-40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                            <p className="text-white text-xs font-bold line-clamp-2">{homepageContent.hero_headline}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Stats Bar</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {(homepageContent.stats || DEFAULT_HOMEPAGE_CONTENT.stats!).map((stat, i) => (
                        <div key={i} className="bg-muted/50 p-4 rounded-xl space-y-3">
                          <div className="space-y-1">
                            <SectionLabel>Value</SectionLabel>
                            <Input
                              value={stat.value}
                              onChange={e => {
                                const updated = [...(homepageContent.stats || DEFAULT_HOMEPAGE_CONTENT.stats!)];
                                updated[i] = { ...updated[i], value: e.target.value };
                                setHomepageContent({ ...homepageContent, stats: updated });
                              }}
                              className="h-8 text-sm font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <SectionLabel>Label</SectionLabel>
                            <Input
                              value={stat.label}
                              onChange={e => {
                                const updated = [...(homepageContent.stats || DEFAULT_HOMEPAGE_CONTENT.stats!)];
                                updated[i] = { ...updated[i], label: e.target.value };
                                setHomepageContent({ ...homepageContent, stats: updated });
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manufacturing Section */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4 flex items-center gap-2"><Settings className="h-4 w-4 text-primary" />Manufacturing Section</h3>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <SectionLabel>Section Headline</SectionLabel>
                          <Input
                            value={homepageContent.manufacturing_headline || ""}
                            onChange={e => setHomepageContent({ ...homepageContent, manufacturing_headline: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Section Body Text</SectionLabel>
                          <textarea
                            rows={5}
                            value={homepageContent.manufacturing_body || ""}
                            onChange={e => setHomepageContent({ ...homepageContent, manufacturing_body: e.target.value })}
                            className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Manufacturing Image URL</SectionLabel>
                          <Input
                            value={mfgImageUrl}
                            onChange={e => { setMfgImageUrl(e.target.value); setMfgPreview(e.target.value); }}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-2">
                          <SectionLabel>Or Upload Manufacturing Image</SectionLabel>
                          <label className="flex items-center gap-2 cursor-pointer border rounded-xl p-3 hover:bg-muted/50 transition-colors">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{mfgFile ? mfgFile.name : "Click to upload image…"}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setMfgFile(e.target.files[0]); setMfgPreview(URL.createObjectURL(e.target.files[0])); } }} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <SectionLabel>Preview</SectionLabel>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted">
                          {mfgPreview ? (
                            <img src={mfgPreview} alt="Manufacturing preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <ImageIcon className="h-8 w-8 opacity-40" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Showcase Products */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4 flex items-center gap-2"><Package className="h-4 w-4 text-primary" />Featured Product Lines</h3>
                    <div className="space-y-6">
                      {(homepageContent.showcase_products || DEFAULT_HOMEPAGE_CONTENT.showcase_products!).map((product, i) => (
                        <div key={i} className="grid lg:grid-cols-3 gap-6 p-4 bg-muted/30 rounded-xl">
                          <div className="lg:col-span-2 space-y-4">
                            <p className="text-xs font-bold uppercase text-muted-foreground">Product {i + 1}</p>
                            <div className="space-y-2">
                              <SectionLabel>Title</SectionLabel>
                              <Input
                                value={product.title}
                                onChange={e => {
                                  const updated = [...(homepageContent.showcase_products || DEFAULT_HOMEPAGE_CONTENT.showcase_products!)];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  setHomepageContent({ ...homepageContent, showcase_products: updated });
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <SectionLabel>Description</SectionLabel>
                              <textarea
                                rows={4}
                                value={product.description}
                                onChange={e => {
                                  const updated = [...(homepageContent.showcase_products || DEFAULT_HOMEPAGE_CONTENT.showcase_products!)];
                                  updated[i] = { ...updated[i], description: e.target.value };
                                  setHomepageContent({ ...homepageContent, showcase_products: updated });
                                }}
                                className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                              />
                            </div>
                            <div className="space-y-2">
                              <SectionLabel>Image URL</SectionLabel>
                              <Input
                                value={product.image}
                                onChange={e => {
                                  const updated = [...(homepageContent.showcase_products || DEFAULT_HOMEPAGE_CONTENT.showcase_products!)];
                                  updated[i] = { ...updated[i], image: e.target.value };
                                  setHomepageContent({ ...homepageContent, showcase_products: updated });
                                }}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div>
                            <SectionLabel>Preview</SectionLabel>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted">
                              {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                  <ImageIcon className="h-8 w-8 opacity-40" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={savingWebsite} className="gap-2 px-8">
                      {savingWebsite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Website Content
                    </Button>
                  </div>

                  <SaveBanner saving={savingWebsite} saved={savedWebsite} />
                </form>
              )}

              {/* ── SETTINGS ── */}
              {activeTab === "settings" && storeSettings && (
                <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-lg">Store Settings</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Manage contact info, branding, and integrations.</p>
                    </div>
                    <Button type="submit" disabled={savingSettings} className="gap-2">
                      {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Settings
                    </Button>
                  </div>

                  {/* Branding */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4">Branding</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <SectionLabel>Store Name</SectionLabel>
                        <Input
                          value={storeSettings.store_name || ""}
                          onChange={e => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                          placeholder="Jinyu Capital"
                        />
                      </div>
                      <div className="space-y-4">
                        <SectionLabel>Store Logo</SectionLabel>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-muted border flex items-center justify-center overflow-hidden relative group flex-shrink-0">
                            {logoPreview ? (
                              <>
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                <button type="button" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white" onClick={() => { setLogoFile(null); setLogoPreview(""); }}>
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center">
                                <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                                <span className="text-[10px]">Upload</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { if (e.target.files?.[0]) { setLogoFile(e.target.files[0]); setLogoPreview(URL.createObjectURL(e.target.files[0])); } }} />
                          </div>
                          <p className="text-xs text-muted-foreground">Upload your company logo. Recommended: PNG with transparent background, min 200×200px.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <SectionLabel>Support Email</SectionLabel>
                        <Input type="email" value={storeSettings.email || ""} onChange={e => setStoreSettings({ ...storeSettings, email: e.target.value })} placeholder="sales@example.com" />
                      </div>
                      <div className="space-y-2">
                        <SectionLabel>Support Phone</SectionLabel>
                        <Input type="tel" value={storeSettings.phone || ""} onChange={e => setStoreSettings({ ...storeSettings, phone: e.target.value })} placeholder="+1 000 000 0000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Office Address</SectionLabel>
                      <textarea
                        rows={2}
                        value={storeSettings.address || ""}
                        onChange={e => setStoreSettings({ ...storeSettings, address: e.target.value })}
                        className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                        placeholder="Full mailing address…"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4">Social Media Links</h3>
                    <div className="space-y-4">
                      {[
                        { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/yourpage" },
                        { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/yourhandle" },
                        { key: "tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@yourhandle" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className="space-y-2">
                          <SectionLabel>{label}</SectionLabel>
                          <Input
                            type="url"
                            value={(storeSettings as any)[key] || ""}
                            onChange={e => setStoreSettings({ ...storeSettings, [key]: e.target.value })}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Currency & Pricing */}
                  <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
                    <h3 className="font-bold border-b pb-4">Currency & Pricing</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <SectionLabel>AUD Exchange Rate (1 USD =)</SectionLabel>
                        <Input
                          type="number"
                          step="0.0001"
                          value={storeSettings.aud_rate || ""}
                          onChange={e => setStoreSettings({ ...storeSettings, aud_rate: parseFloat(e.target.value) })}
                          placeholder="1.52"
                        />
                      </div>
                      <div className="space-y-2">
                        <SectionLabel>NGN Exchange Rate (1 USD =)</SectionLabel>
                        <Input
                          type="number"
                          step="0.01"
                          value={storeSettings.ngn_rate || ""}
                          onChange={e => setStoreSettings({ ...storeSettings, ngn_rate: parseFloat(e.target.value) })}
                          placeholder="1600"
                        />
                      </div>
                      <div className="space-y-2">
                        <SectionLabel>Global Wholesale MOQ</SectionLabel>
                        <Input
                          type="number"
                          value={storeSettings.global_wholesale_moq || ""}
                          onChange={e => setStoreSettings({ ...storeSettings, global_wholesale_moq: parseInt(e.target.value) })}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={savingSettings} className="gap-2 px-8">
                      {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Settings
                    </Button>
                  </div>

                  <SaveBanner saving={savingSettings} saved={savedSettings} />
                </form>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
