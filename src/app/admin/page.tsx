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
  Check,
  BookOpen,
  ChevronRight,
  Info,
  Lightbulb,
  ShieldCheck,
  Zap,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type HomepageContent, type HomepageStat, type ShowcaseProduct, useStoreSettings } from "@/components/StoreSettingsContext";
import { DEFAULT_SHOWCASE } from "@/lib/default-images";

type AdminTab = "overview" | "products" | "orders" | "quotes" | "distributors" | "contacts" | "newsletter" | "website" | "settings" | "admins" | "docs" | "blog";

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
  showcase_products: [...DEFAULT_SHOWCASE],
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

// ── Documentation Tab ─────────────────────────────────────────────────────────

function DocsTab() {
  const docs = [
    {
      category: "Getting Started",
      items: [
        {
          title: "Dashboard Overview",
          description: "Understanding your admin dashboard",
          steps: [
            "The Overview tab shows your store's key metrics at a glance: total revenue, number of orders, product count, and low stock alerts",
            "Recent orders are displayed in a table showing customer name, email, date, amount, and status",
            "Quick stats show pending quotes, new distributor applications, unread messages, and active subscribers",
            "Click the refresh button (top right) to update all data with the latest information"
          ]
        },
        {
          title: "Navigation Guide",
          description: "How to navigate the admin panel",
          steps: [
            "Use the left sidebar to switch between different sections: Overview, Products, Orders, Quotes, Distributors, Contacts, Newsletter, Website Content, Settings, and Documentation",
            "On mobile devices, tap the menu icon to open the navigation sidebar",
            "Each section has its own tools and management features specific to that area",
            "Click your profile name in the top right to sign out of the admin panel"
          ]
        }
      ]
    },
    {
      category: "Product Management",
      items: [
        {
          title: "How to Add a New Product",
          description: "Step-by-step guide to creating products",
          steps: [
            "Go to the Products tab and click 'Add Product' button",
            "Fill in the product name, description, and category",
            "Enter the stock quantity available",
            "Upload product images by clicking the upload area and selecting image files from your computer",
            "Click 'Save Product' to add the product to your catalog"
          ]
        },
        {
          title: "How to Update Product Stock",
          description: "Managing inventory levels",
          steps: [
            "Navigate to the Products tab",
            "Find the product you want to update in the list",
            "Click the edit (pencil) icon next to the stock quantity",
            "Enter the new stock quantity",
            "Click the checkmark to save the changes",
            "The stock level will update immediately and low stock alerts will adjust accordingly"
          ]
        },
        {
          title: "How to Upload Product Images",
          description: "Adding images to your products",
          steps: [
            "When adding or editing a product, locate the image upload section",
            "Click 'Choose File' or the upload area",
            "Select one or more image files from your computer (JPG, PNG, WebP formats supported)",
            "Images will be automatically uploaded to Supabase storage",
            "The first image will be set as the main product image",
            "Additional images will appear in the product gallery"
          ]
        }
      ]
    },
    {
      category: "Order Management",
      items: [
        {
          title: "How to View Order Details",
          description: "Accessing complete order information",
          steps: [
            "Go to the Orders tab to see all customer orders",
            "Orders are listed with customer name, date, amount, and current status",
            "Click on any order row to expand and view full details",
            "Expanded view shows customer contact information, shipping address, and all items in the order",
            "Use the search bar to find specific orders by customer name or email"
          ]
        },
        {
          title: "How to Update Order Status",
          description: "Managing order fulfillment",
          steps: [
            "Open the Orders tab and find the order you want to update",
            "Click on the order to expand it and see the status dropdown",
            "Select the new status from the dropdown menu: Pending, Processing, Shipped, Delivered, or Cancelled",
            "The status change is saved automatically",
            "Customers can be notified of status updates through your configured notification system"
          ]
        }
      ]
    },
    {
      category: "Website Content",
      items: [
        {
          title: "How to Customize the Homepage",
          description: "Editing homepage content and images",
          steps: [
            "Navigate to the Website Content tab in the admin panel",
            "Edit the Hero Headline and Sub-headline text fields to change the main homepage text",
            "Update statistics values and labels in the Stats section",
            "Modify the Manufacturing section headline and body text",
            "Edit featured product information in the Showcase Products section",
            "Click 'Save All Changes' to apply your updates to the live website"
          ]
        },
        {
          title: "How to Upload Homepage Images",
          description: "Changing hero and manufacturing images",
          steps: [
            "Go to the Website Content tab",
            "In the Hero Section, click 'Click to upload image…' to select a new hero image from your computer",
            "In the Manufacturing Section, click 'Click to upload image…' to select a new manufacturing image",
            "Alternatively, paste a direct image URL in the URL input fields",
            "Preview your images before saving",
            "Click 'Save All Changes' to upload and apply the new images",
            "The homepage will automatically refresh with the new images"
          ]
        },
        {
          title: "How to Configure Store Settings",
          description: "Managing store-wide configuration",
          steps: [
            "Go to the Settings tab",
            "Update your store name, email, phone number, and physical address",
            "Add social media links for Facebook, Instagram, and TikTok",
            "Set currency conversion rates (AUD and NGN)",
            "Configure the global wholesale minimum order quantity",
            "Upload your company logo by clicking the logo upload area",
            "Click 'Save Settings' to apply all changes"
          ]
        }
      ]
    },
    {
      category: "Customer Engagement",
      items: [
        {
          title: "How to Manage Quote Requests",
          description: "Handling bulk order inquiries",
          steps: [
            "Go to the Quotes tab to see all quote requests",
            "Each request shows customer details, requested products, and status (new, contacted, won, lost)",
            "Click on a quote to view full details and customer message",
            "Update the quote status as you progress through the sales process",
            "Use the contact information provided to reach out to customers"
          ]
        },
        {
          title: "How to Review Distributor Applications",
          description: "Processing partnership requests",
          steps: [
            "Navigate to the Distributors tab",
            "View applications showing company name, contact person, and application status",
            "Click on an application to see the full business details and application message",
            "Update the status to 'approved', 'rejected', or 'under review' based on your assessment",
            "Contact applicants directly using the provided information"
          ]
        },
        {
          title: "How to Handle Contact Messages",
          description: "Managing customer inquiries",
          steps: [
            "Go to the Contacts tab to view all messages from the contact form",
            "Messages show sender name, email, subject, and read status",
            "Click on a message to read the full content",
            "Mark messages as 'read' after reviewing them",
            "Respond to customers using the email address provided"
          ]
        },
        {
          title: "How to Manage Newsletter Subscribers",
          description: "Building and maintaining email lists",
          steps: [
            "Navigate to the Newsletter tab",
            "View all subscribers with their email addresses and subscription status",
            "Add new subscribers manually by entering their email address and clicking 'Add Subscriber'",
            "Deactivate subscribers by clicking the deactivate button next to their email",
            "Use the compose section to draft and send newsletter emails to active subscribers"
          ]
        }
      ]
    },
    {
      category: "Account Management",
      items: [
        {
          title: "How to Sign In",
          description: "Accessing the admin panel",
          steps: [
            "Navigate to /login on your website",
            "Enter your admin email address and password",
            "Click 'Sign In' to authenticate",
            "If credentials are correct and you have admin privileges, you'll be redirected to the dashboard",
            "If you forgot your password, use the 'Forgot Password' link to reset it"
          ]
        },
        {
          title: "How to Sign Out",
          description: "Securely ending your session",
          steps: [
            "Click on your profile name or email in the top right corner of the admin panel",
            "Select 'Sign Out' from the dropdown menu",
            "You will be redirected to the login page",
            "Your session is now ended and you'll need to sign in again to access the admin panel"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-3">Admin User Guide</h2>
        <p className="text-muted-foreground max-w-2xl">
          Step-by-step instructions for managing your Jinyu Capital website through the admin panel.
        </p>
      </div>

      {docs.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-6">
          <h3 className="text-xl font-bold border-b pb-3">{section.category}</h3>
          <div className="grid gap-6">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-card border rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {item.title}
                </h4>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-3 text-foreground">Steps:</p>
                  <ol className="space-y-2">
                    {item.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Need Additional Help?
        </h4>
        <p className="text-blue-800 text-sm mb-3">
          If you encounter issues not covered in this guide or need technical assistance, please contact support.
        </p>
        <Button variant="outline" size="sm" className="border-blue-300 text-blue-900 hover:bg-blue-100">
          <ExternalLink className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();
  const { refreshSettings } = useStoreSettings();

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

  // Showcase product image uploads
  const [showcaseFiles, setShowcaseFiles] = useState<(File | null)[]>([null, null, null]);
  const [showcasePreviews, setShowcasePreviews] = useState<string[]>(["", "", ""]);

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

  // Administrator management
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordConfirmation, setAdminPasswordConfirmation] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [adminUserMessage, setAdminUserMessage] = useState("");

  // Quote editing
  const [editingQuote, setEditingQuote] = useState<string | null>(null);
  const [quoteEditData, setQuoteEditData] = useState<any>(null);

  // Blog posts management states
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [blogSearch, setBlogSearch] = useState("");
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("Explosion-Proof Lighting");
  const [blogFeaturedImage, setBlogFeaturedImage] = useState("");
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [savingBlog, setSavingBlog] = useState(false);
  const [blogMessage, setBlogMessage] = useState("");

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
        { data: blogData },
      ] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("orders").select("*, order_items(*, products(*))").order("created_at", { ascending: false }),
        supabase.from("store_settings").select("*").eq("id", 1).single(),
        supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
        supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("distributor_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
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
      setBlogPosts(blogData || []);

      if (settingsData) {
        setStoreSettings(settingsData);
        if (settingsData.logo_url) setLogoPreview(settingsData.logo_url);
        if (settingsData.hero_image_url) { setHeroImageUrl(settingsData.hero_image_url); setHeroPreview(settingsData.hero_image_url); }
        if (settingsData.manufacturing_image_url) { setMfgImageUrl(settingsData.manufacturing_image_url); setMfgPreview(settingsData.manufacturing_image_url); }
        if (settingsData.homepage_content && Object.keys(settingsData.homepage_content).length > 0) {
          setHomepageContent({ ...DEFAULT_HOMEPAGE_CONTENT, ...settingsData.homepage_content });
          if (settingsData.homepage_content.showcase_products) {
        setShowcasePreviews(settingsData.homepage_content.showcase_products.map((p: ShowcaseProduct) => p.image));
          }
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

      // Handle showcase product image uploads
      const updatedShowcaseProducts = [...(homepageContent.showcase_products || DEFAULT_HOMEPAGE_CONTENT.showcase_products!)];
      for (let i = 0; i < showcaseFiles.length; i++) {
        if (showcaseFiles[i]) {
          const uploadedUrl = await uploadFile(showcaseFiles[i]!, "showcase");
          updatedShowcaseProducts[i] = { ...updatedShowcaseProducts[i], image: uploadedUrl };
        }
      }

      const finalHomepageContent = {
        ...homepageContent,
        showcase_products: updatedShowcaseProducts,
      };

      const { error } = await supabase.from("store_settings").upsert({
        id: 1,
        hero_image_url: finalHeroUrl,
        manufacturing_image_url: finalMfgUrl,
        homepage_content: finalHomepageContent,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setHeroImageUrl(finalHeroUrl);
      setMfgImageUrl(finalMfgUrl);
      if (finalHeroUrl) setHeroPreview(finalHeroUrl);
      if (finalMfgUrl) setMfgPreview(finalMfgUrl);
      setHomepageContent(finalHomepageContent);
      setShowcaseFiles([null, null, null]);
      setShowcasePreviews(updatedShowcaseProducts.map(p => p.image));
      setSavedWebsite(true);
      setTimeout(() => setSavedWebsite(false), 2500);
      // Refresh settings to update homepage
      await refreshSettings();
    } catch (err: any) {
      alert("Error saving website content: " + err.message);
    } finally {
      setSavingWebsite(false);
    }
  };

  // ── Auth guard ───────────────────────────────────────────────────────────

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminUserMessage("");

    if (adminPassword !== adminPasswordConfirmation) {
      setAdminUserMessage("Passwords do not match.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setAdminUserMessage("Your session has expired. Please sign in again.");
      return;
    }

    try {
      setCreatingAdmin(true);
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name: adminName, email: adminEmail, password: adminPassword }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create the administrator.");

      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      setAdminPasswordConfirmation("");
      setAdminUserMessage(`Administrator account created for ${result.email}.`);
    } catch (err: any) {
      setAdminUserMessage(err.message || "Unable to create the administrator.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Blog handlers
  const handleOpenNewBlogForm = () => {
    setCurrentBlogId(null);
    setBlogTitle("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogCategory("Explosion-Proof Lighting");
    setBlogFeaturedImage("");
    setBlogImageFile(null);
    setBlogImagePreview("");
    setBlogMessage("");
    setIsEditingBlog(true);
  };

  const handleOpenEditBlogForm = (post: any) => {
    setCurrentBlogId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogCategory(post.category);
    setBlogFeaturedImage(post.featured_image_url || "");
    setBlogImageFile(null);
    setBlogImagePreview(post.featured_image_url || "");
    setBlogMessage("");
    setIsEditingBlog(true);
  };

  const handleTitleChange = (val: string) => {
    setBlogTitle(val);
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setBlogSlug(slugVal);
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogSlug.trim() || !blogExcerpt.trim() || !blogContent.trim()) {
      setBlogMessage("Please fill in all required fields.");
      return;
    }

    try {
      setSavingBlog(true);
      setBlogMessage("");

      let imageUrl = blogFeaturedImage;
      if (blogImageFile) {
        imageUrl = await uploadFile(blogImageFile, "blog");
      }

      const postPayload = {
        title: blogTitle.trim(),
        slug: blogSlug.trim(),
        excerpt: blogExcerpt.trim(),
        content: blogContent.trim(),
        category: blogCategory,
        featured_image_url: imageUrl || null,
        author: "Admin",
        updated_at: new Date().toISOString()
      };

      if (currentBlogId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postPayload)
          .eq("id", currentBlogId);
        if (error) throw error;
        setBlogMessage("Blog post updated successfully!");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert({
            ...postPayload,
            created_at: new Date().toISOString()
          });
        if (error) throw error;
        setBlogMessage("Blog post created successfully!");
      }

      await loadAdminDataset();
      setTimeout(() => {
        setIsEditingBlog(false);
      }, 1000);
    } catch (err: any) {
      console.error("Save blog post failed:", err);
      setBlogMessage(err.message || "Failed to save blog post.");
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setBlogPosts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

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

  const filteredBlogPosts = blogPosts.filter(p =>
    p.title?.toLowerCase().includes(blogSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(blogSearch.toLowerCase())
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
    { id: "blog", label: "News & Blog", icon: FileText },
    { id: "admins", label: "Admin Users", icon: Users },
    { id: "docs", label: "Documentation", icon: BookOpen, href: "/admin/documentation" },
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
                onClick={() => {
                  if ("href" in item) window.open(item.href, "_blank", "noopener,noreferrer");
                  else setActiveTab(item.id as AdminTab);
                  setIsMobileMenuOpen(false);
                }}
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
            <h1 className="text-lg font-bold capitalize">{activeTab === "website" ? "Website Content" : activeTab === "docs" ? "Documentation" : activeTab}</h1>
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
                            <div className="space-y-2">
                              <SectionLabel>Or Upload New Image</SectionLabel>
                              <label className="flex items-center gap-2 cursor-pointer border rounded-xl p-3 hover:bg-muted/50 transition-colors">
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{showcaseFiles[i] ? showcaseFiles[i].name : "Click to upload image…"}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => {
                                  if (e.target.files?.[0]) {
                                    const newFiles = [...showcaseFiles];
                                    newFiles[i] = e.target.files[0];
                                    setShowcaseFiles(newFiles);
                                    const newPreviews = [...showcasePreviews];
                                    newPreviews[i] = URL.createObjectURL(e.target.files[0]);
                                    setShowcasePreviews(newPreviews);
                                  }
                                }} />
                              </label>
                            </div>
                          </div>
                          <div>
                            <SectionLabel>Preview</SectionLabel>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-muted">
                              {showcasePreviews[i] || product.image ? (
                                <img src={showcasePreviews[i] || product.image} alt={product.title} className="w-full h-full object-cover" />
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

              {/* ── BLOG MANAGEMENT ── */}
              {activeTab === "blog" && (
                <div className="space-y-6">
                  {isEditingBlog ? (
                    <form onSubmit={handleSaveBlogPost} className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h2 className="text-xl font-bold">
                            {currentBlogId ? "Edit Blog Post" : "Create Blog Post"}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Compose and publish articles to your website.
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingBlog(false)}>
                          Cancel
                        </Button>
                      </div>

                      <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="space-y-2">
                          <SectionLabel>Title *</SectionLabel>
                          <Input 
                            value={blogTitle} 
                            onChange={e => handleTitleChange(e.target.value)} 
                            placeholder="Enter article title" 
                            required 
                          />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <SectionLabel>Slug (URL) *</SectionLabel>
                            <Input 
                              value={blogSlug} 
                              onChange={e => setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-"))} 
                              placeholder="article-url-slug" 
                              required 
                            />
                          </div>

                          <div className="space-y-2">
                            <SectionLabel>Category *</SectionLabel>
                            <select 
                              value={blogCategory} 
                              onChange={e => setBlogCategory(e.target.value)} 
                              className="w-full text-sm rounded-lg border bg-background p-2.5 outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="Explosion-Proof Lighting">Explosion-Proof Lighting</option>
                              <option value="Industrial Equipment">Industrial Equipment</option>
                              <option value="Industry News & Insights">Industry News & Insights</option>
                              <option value="OEM/ODM Solutions">OEM/ODM Solutions</option>
                              <option value="Product Updates">Product Updates</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <SectionLabel>Excerpt *</SectionLabel>
                          <Input 
                            value={blogExcerpt} 
                            onChange={e => setBlogExcerpt(e.target.value)} 
                            placeholder="Brief summary of the article for listings (1-2 sentences)" 
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <SectionLabel>Featured Image</SectionLabel>
                          <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="w-28 h-20 rounded-lg border overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                              {blogImagePreview ? (
                                <img src={blogImagePreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <FileText className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setBlogImageFile(file);
                                    setBlogImagePreview(URL.createObjectURL(file));
                                  }
                                }} 
                              />
                              <p className="text-[10px] text-muted-foreground">Upload a PNG, JPG, or WEBP image. Will be uploaded to Supabase Storage.</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <SectionLabel>Content (Supports Markdown) *</SectionLabel>
                          <Textarea 
                            value={blogContent} 
                            onChange={e => setBlogContent(e.target.value)} 
                            placeholder="Write your article content here..." 
                            rows={15} 
                            required 
                          />
                        </div>

                        {blogMessage && (
                          <div className="rounded-lg bg-muted px-4 py-3 text-sm font-semibold text-primary" role="status">
                            {blogMessage}
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                          <Button type="button" variant="outline" onClick={() => setIsEditingBlog(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={savingBlog} className="gap-2">
                            {savingBlog ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {currentBlogId ? "Update Post" : "Publish Post"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Search articles…" 
                            className="pl-10" 
                            value={blogSearch} 
                            onChange={e => setBlogSearch(e.target.value)} 
                          />
                        </div>
                        <Button onClick={handleOpenNewBlogForm}>
                          <Plus className="h-4 w-4 mr-2" />New Post
                        </Button>
                      </div>

                      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Article</th>
                              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Category</th>
                              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Published</th>
                              <th className="px-6 py-4 text-center font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredBlogPosts.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                  No articles found. Click "New Post" to create your first article!
                                </td>
                              </tr>
                            ) : (
                              filteredBlogPosts.map(post => (
                                <tr key={post.id} className="hover:bg-muted/30">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-10 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                                        {post.featured_image_url ? (
                                          <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover" />
                                        ) : (
                                          <FileText className="w-full h-full p-2 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-bold line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">/{post.slug}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-muted-foreground">{post.category}</td>
                                  <td className="px-6 py-4 text-muted-foreground text-xs">
                                    {new Date(post.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleOpenEditBlogForm(post)}>
                                        <Pencil className="h-3 w-3 mr-1.5" />Edit
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDeleteBlogPost(post.id)}>
                                        <Trash2 className="h-3 w-3 mr-1.5" />Delete
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── DOCUMENTATION ── */}
              {activeTab === "admins" && (
                <form onSubmit={handleCreateAdmin} className="max-w-2xl space-y-6">
                  <div>
                    <h2 className="text-lg font-bold">Add an administrator</h2>
                    <p className="mt-1 text-sm text-muted-foreground">New administrators can sign in and manage the website immediately.</p>
                  </div>

                  <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="space-y-2">
                      <SectionLabel>Name</SectionLabel>
                      <Input value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Administrator name" autoComplete="name" />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Email address</SectionLabel>
                      <Input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@example.com" autoComplete="email" required />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <SectionLabel>Temporary password</SectionLabel>
                        <Input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} minLength={12} autoComplete="new-password" required />
                      </div>
                      <div className="space-y-2">
                        <SectionLabel>Confirm password</SectionLabel>
                        <Input type="password" value={adminPasswordConfirmation} onChange={e => setAdminPasswordConfirmation(e.target.value)} minLength={12} autoComplete="new-password" required />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Use at least 12 characters. Share the temporary password securely.</p>
                    {adminUserMessage && <p className="rounded-lg bg-muted px-3 py-2 text-sm" role="status">{adminUserMessage}</p>}
                    <div className="flex justify-end">
                      <Button type="submit" disabled={creatingAdmin} className="gap-2">
                        {creatingAdmin ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                        Create administrator
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "docs" && <DocsTab />}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
