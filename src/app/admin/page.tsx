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
  User,
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
  Phone
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "quotes" | "distributors" | "contacts" | "settings" | "newsletter">("overview");

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin Data State
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [distributorApplications, setDistributorApplications] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Expandable row state for Orders
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Edit stock buffer state
  const [stockEditValues, setStockEditValues] = useState<Record<string, number>>({});

  // Newsletter email broadcast state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [newSubscriberEmail, setNewSubscriberEmail] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Fetch Dataset
  const loadAdminDataset = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (prodError) throw prodError;
      setProducts(prodData || []);

      // Initialize stock edit buffers
      const stockBuffer: Record<string, number> = {};
      (prodData || []).forEach(p => {
        stockBuffer[p.id] = p.stock_quantity ?? 0;
      });
      setStockEditValues(stockBuffer);

      // 2. Fetch Orders with nested items and products
      const { data: ordData, error: ordError } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .order("created_at", { ascending: false });

      if (ordError) throw ordError;
      setOrders(ordData || []);

      // 4. Fetch Store Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (!settingsError && settingsData) {
        setStoreSettings(settingsData);
        if (settingsData.logo_url) {
          setLogoPreview(settingsData.logo_url);
        }
      }

      // 5. Fetch Newsletter Subscribers
      const { data: subData } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      setSubscribers(subData || []);

      // 7. Fetch Quote Requests
      const { data: quotesData } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setQuoteRequests(quotesData || []);

      // 8. Fetch Distributor Applications
      const { data: distData } = await supabase
        .from("distributor_applications")
        .select("*")
        .order("created_at", { ascending: false });
      setDistributorApplications(distData || []);

      // 9. Fetch Contact Messages
      const { data: contactData } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setContactMessages(contactData || []);

    } catch (err: any) {
      console.error("Dashboard database fetch failed:", err);
      setError(err.message || "Failed to load dashboard parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (!isAdmin) {
        router.push("/");
        return;
      }
      loadAdminDataset();
    }
  }, [user, isAdmin]);

  // Restock trigger
  const handleSaveStock = async (productId: string) => {
    const updatedStock = stockEditValues[productId];
    if (updatedStock === undefined || updatedStock < 0) return;

    try {
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: updatedStock })
        .eq("id", productId);

      if (updateError) throw updateError;

      setProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, stock_quantity: updatedStock } : p)
      );
      alert("Stock restocked successfully!");
    } catch (err: any) {
      console.error("Stock update failed:", err);
      alert("Failed to update stock: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error: delError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (delError) throw delError;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err: any) {
      console.error("Deletion failed:", err);
      alert("Failed to delete product: " + err.message);
    }
  };

  // Update Order shipment status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setOrders(prev => 
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err: any) {
      console.error("Status update failed:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;

    try {
      const { error: delError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (delError) throw delError;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err: any) {
      console.error("Order deletion failed:", err);
      alert("Failed to delete order: " + err.message);
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const { error: delError } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", subscriberId);
      if (delError) throw delError;
      setSubscribers(prev => prev.filter(s => s.id !== subscriberId));
    } catch (err: any) {
      alert("Failed to remove subscriber: " + err.message);
    }
  };

  // Export subscribers as CSV
  const handleExportCSV = () => {
    const activeOnly = subscribers.filter(s => s.is_active);
    const csv = ["Email,Subscribed At", ...activeOnly.map(s => `${s.email},${s.subscribed_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jinyu_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send newsletter via mailto BCC
  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const activeEmails = subscribers.filter(s => s.is_active).map(s => s.email);
    if (activeEmails.length === 0) { alert("No active subscribers."); return; }
    const bcc = activeEmails.join(",");
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(emailBody);
    window.open(`mailto:?bcc=${bcc}&subject=${subject}&body=${body}`, "_blank");
  };

  // Add subscriber manually
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriberEmail || !newSubscriberEmail.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setAddingSubscriber(true);
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: newSubscriberEmail, is_active: true });

      if (error) throw error;

      setNewSubscriberEmail("");
      alert("Subscriber added successfully!");
      loadAdminDataset();
    } catch (err: any) {
      console.error("Failed to add subscriber:", err);
      alert("Failed to add subscriber: " + err.message);
    } finally {
      setAddingSubscriber(false);
    }
  };

  // Logo File Change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingSettings) return;

    try {
      setSavingSettings(true);
      let finalLogoUrl = storeSettings?.logo_url || "";

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const filePath = `store/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalLogoUrl = publicData.publicUrl;
      }

      const { error: settingsError } = await supabase
        .from("store_settings")
        .upsert({ 
          ...storeSettings, 
          logo_url: finalLogoUrl,
          id: 1, 
          updated_at: new Date().toISOString() 
        });

      if (settingsError) throw settingsError;
      alert("Settings updated!");
    } catch (err: any) {
      console.error("Save settings error:", err);
      alert("Error saving settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Quote Requests Handlers
  const handleUpdateQuoteStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) { alert("Failed to update status."); return; }
    setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm("Delete quote?")) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) { alert("Failed to delete."); return; }
    setQuoteRequests(prev => prev.filter(q => q.id !== id));
  };

  const handleUpdateDistributorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("distributor_applications").update({ status }).eq("id", id);
    if (error) { alert("Failed to update status."); return; }
    setDistributorApplications(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleDeleteDistributor = async (id: string) => {
    if (!confirm("Delete distributor app?")) return;
    const { error } = await supabase.from("distributor_applications").delete().eq("id", id);
    if (error) { alert("Failed to delete."); return; }
    setDistributorApplications(prev => prev.filter(d => d.id !== id));
  };

  const handleUpdateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) { alert("Failed to update status."); return; }
    setContactMessages(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Delete message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { alert("Failed to delete."); return; }
    setContactMessages(prev => prev.filter(c => c.id !== id));
  };

  // Auth restriction gate
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

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? Number(o.total_amount) : 0), 0);
  const lowStockCount = products.filter(p => (p.stock_quantity ?? 0) < 5).length;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.first_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.last_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "quotes", label: "Quotes", icon: FileText, badge: quoteRequests.filter(q => q.status === "new").length },
    { id: "distributors", label: "Distributors", icon: Building2, badge: distributorApplications.filter(d => d.status === "new").length },
    { id: "contacts", label: "Messages", icon: MessageSquare, badge: contactMessages.filter(c => c.status === "unread").length },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 md:translate-x-0 md:static ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">ADMIN</span>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                {item.badge ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-white text-primary" : "bg-primary text-white"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-muted/30">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 hover:bg-muted rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={loadAdminDataset} title="Refresh Data">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Link href="/">
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
              <p className="text-muted-foreground text-sm">Loading data...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
                      <div className="bg-amber-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-amber-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                    </div>
                    <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="bg-red-500/10 w-10 h-10 rounded-xl flex items-center justify-center text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                  </div>

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
                          {orders.slice(0, 5).map((o) => (
                            <tr key={o.id} className="hover:bg-muted/30">
                              <td className="px-6 py-4">
                                <p className="font-bold">{o.first_name} {o.last_name}</p>
                                <p className="text-xs text-muted-foreground">{o.email}</p>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 font-bold">${Number(o.total_amount).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                  o.status === "Shipped" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search products..." 
                        className="pl-10" 
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>
                    <Button asChild>
                      <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Link>
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
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-muted/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                            <td className="px-6 py-4 font-bold">${p.price}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={stockEditValues[p.id] ?? p.stock_quantity}
                                  onChange={(e) => setStockEditValues({...stockEditValues, [p.id]: parseInt(e.target.value)})}
                                  className="w-16 h-8 rounded border px-2 text-xs"
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search orders..." 
                        className="pl-10" 
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {["All", "Pending", "Processing", "Shipped"].map(status => (
                        <Button 
                          key={status} 
                          variant={orderStatusFilter === status ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setOrderStatusFilter(status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="w-10 px-4"></th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">ID</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Customer</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Amount</th>
                          <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-center font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredOrders.map((o) => (
                          <React.Fragment key={o.id}>
                            <tr className="hover:bg-muted/30">
                              <td className="px-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}>
                                  {expandedOrderId === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{o.id.substring(0, 8)}</td>
                              <td className="px-6 py-4 font-bold">{o.first_name} {o.last_name}</td>
                              <td className="px-6 py-4 font-bold">${Number(o.total_amount).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={o.status}
                                  onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                  className="bg-background border rounded px-2 py-1 text-xs font-bold outline-none"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Cancelled">Cancelled</option>
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
                                <td colSpan={6} className="p-6">
                                  <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shipping Details</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>{o.first_name} {o.last_name}</p>
                                        <p>{o.address}</p>
                                        <p>{o.city}, {o.postal_code}</p>
                                        <p>{o.phone}</p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</h4>
                                      <div className="space-y-2">
                                        {o.order_items?.map((item: any) => (
                                          <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span>{item.products?.name} x {item.quantity}</span>
                                            <span className="font-bold">${item.price * item.quantity}</span>
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
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Quotes Tab */}
              {activeTab === "quotes" && (
                <div className="space-y-4">
                  {quoteRequests.map(q => (
                    <div key={q.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold">{q.first_name} {q.last_name} · <span className="text-muted-foreground font-normal">{q.company_name}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">{q.email} · {q.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={q.status}
                            onChange={e => handleUpdateQuoteStatus(q.id, e.target.value)}
                            className="bg-background border rounded px-2 py-1 text-xs font-bold"
                          >
                            <option value="new">New</option>
                            <option value="quoted">Quoted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteQuote(q.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Product</p>
                          <p className="font-medium">{q.product_interest}</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Quantity</p>
                          <p className="font-medium">{q.quantity}</p>
                        </div>
                      </div>
                      {q.message && <div className="p-4 bg-primary/5 border-l-4 border-primary text-sm rounded-r-xl">{q.message}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Distributors Tab */}
              {activeTab === "distributors" && (
                <div className="space-y-4">
                  {distributorApplications.map(d => (
                    <div key={d.id} className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold">{d.contact_name} · <span className="text-muted-foreground font-normal">{d.company_name}</span></p>
                          <p className="text-xs text-muted-foreground mt-1">{d.email} · {d.country}</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={d.status}
                            onChange={e => handleUpdateDistributorStatus(d.id, e.target.value)}
                            className="bg-background border rounded px-2 py-1 text-xs font-bold"
                          >
                            <option value="new">New</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteDistributor(d.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-xl text-sm leading-relaxed">{d.message}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === "contacts" && (
                <div className="space-y-4">
                  {contactMessages.map(c => (
                    <div key={c.id} className={`bg-card border rounded-2xl p-6 shadow-sm space-y-4 ${c.status === "unread" ? "border-primary" : ""}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-bold">{c.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{c.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={c.status}
                            onChange={e => handleUpdateContactStatus(c.id, e.target.value)}
                            className="bg-background border rounded px-2 py-1 text-xs font-bold"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                          </select>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteContact(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-xl text-sm">{c.message}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Newsletter Tab */}
              {activeTab === "newsletter" && (
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Subscribers</h3>
                      <Button variant="outline" size="sm" onClick={handleExportCSV}>Export CSV</Button>
                    </div>
                    <form onSubmit={handleAddSubscriber} className="flex gap-2">
                      <Input
                        placeholder="Add subscriber email..."
                        value={newSubscriberEmail}
                        onChange={e => setNewSubscriberEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={addingSubscriber}>
                        {addingSubscriber ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </form>
                    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-4 text-left font-medium text-muted-foreground">Email</th>
                            <th className="px-6 py-4 text-left font-medium text-muted-foreground">Date</th>
                            <th className="px-6 py-4 text-center text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {subscribers.map(s => (
                            <tr key={s.id}>
                              <td className="px-6 py-4">{s.email}</td>
                              <td className="px-6 py-4 text-muted-foreground">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-center">
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSubscriber(s.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold">Broadcast</h3>
                    <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
                        <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Newsletter Subject" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Message</label>
                        <textarea
                          rows={10}
                          value={emailBody}
                          onChange={e => setEmailBody(e.target.value)}
                          className="w-full bg-background border rounded-xl p-3 text-sm resize-none"
                          placeholder="Email body content..."
                        />
                      </div>
                      <Button className="w-full gap-2" onClick={handleSendNewsletter}>
                        <Send className="h-4 w-4" />
                        Send Broadcast
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && storeSettings && (
                <div className="max-w-2xl bg-card border rounded-2xl p-8 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Store Logo</label>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-muted border flex items-center justify-center overflow-hidden relative group">
                        {logoPreview ? (
                          <>
                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white" onClick={() => {setLogoFile(null); setLogoPreview("");}}>
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                            <span className="text-[10px] font-medium">Upload Logo</span>
                          </div>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Support Email</label>
                        <Input value={storeSettings.email || ""} onChange={e => setStoreSettings({...storeSettings, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Support Phone</label>
                        <Input value={storeSettings.phone || ""} onChange={e => setStoreSettings({...storeSettings, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Office Address</label>
                      <Input value={storeSettings.address || ""} onChange={e => setStoreSettings({...storeSettings, address: e.target.value})} />
                    </div>
                    <Button type="submit" disabled={savingSettings} className="gap-2">
                      {savingSettings ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
