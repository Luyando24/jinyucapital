"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Download,
  Edit3,
  ExternalLink,
  LayoutGrid,
  ListTodo,
  Loader2,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CRMView = "dashboard" | "contacts" | "companies" | "pipeline" | "activities";
type ModalType = "contact" | "company" | "deal" | "activity" | null;

interface Company {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  status: "prospect" | "customer" | "partner" | "inactive";
  size: "solo" | "small" | "medium" | "large" | "enterprise" | null;
  notes: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  lifecycle_stage: "lead" | "prospect" | "opportunity" | "customer" | "partner" | "inactive";
  lead_status: "new" | "attempted" | "contacted" | "qualified" | "nurturing" | "unqualified";
  source: "manual" | "website" | "quote" | "order" | "distributor" | "import" | "referral";
  lead_score: number;
  tags: string[];
  marketing_opt_in: boolean;
  notes: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Deal {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  title: string;
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  amount: number;
  currency: string;
  probability: number;
  priority: "low" | "normal" | "high";
  expected_close_date: string | null;
  closed_at: string | null;
  loss_reason: string | null;
  source: Contact["source"];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CRMActivity {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  deal_id: string | null;
  type: "note" | "email" | "call" | "meeting" | "task" | "status_change";
  status: "open" | "completed" | "cancelled";
  subject: string;
  body: string | null;
  outcome: string | null;
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const DEAL_STAGES: Array<{ id: Deal["stage"]; label: string; probability: number; color: string }> = [
  { id: "lead", label: "Lead", probability: 10, color: "bg-slate-500" },
  { id: "qualified", label: "Qualified", probability: 30, color: "bg-blue-500" },
  { id: "proposal", label: "Proposal", probability: 55, color: "bg-violet-500" },
  { id: "negotiation", label: "Negotiation", probability: 75, color: "bg-amber-500" },
  { id: "won", label: "Won", probability: 100, color: "bg-emerald-500" },
  { id: "lost", label: "Lost", probability: 0, color: "bg-rose-500" },
];

const LIFECYCLE_STAGES: Contact["lifecycle_stage"][] = ["lead", "prospect", "opportunity", "customer", "partner", "inactive"];
const LEAD_STATUSES: Contact["lead_status"][] = ["new", "attempted", "contacted", "qualified", "nurturing", "unqualified"];
const SOURCES: Contact["source"][] = ["manual", "website", "quote", "order", "distributor", "import", "referral"];
const ACTIVITY_TYPES: CRMActivity["type"][] = ["note", "email", "call", "meeting", "task"];

const EMPTY_CONTACT = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  job_title: "",
  company_id: "",
  lifecycle_stage: "lead" as Contact["lifecycle_stage"],
  lead_status: "new" as Contact["lead_status"],
  source: "manual" as Contact["source"],
  lead_score: 20,
  tags: "",
  marketing_opt_in: false,
  notes: "",
  next_follow_up_at: "",
};

const EMPTY_COMPANY = {
  name: "",
  website: "",
  phone: "",
  industry: "",
  country: "",
  city: "",
  address: "",
  status: "prospect" as Company["status"],
  size: "" as Company["size"] | "",
  notes: "",
};

const EMPTY_DEAL = {
  title: "",
  contact_id: "",
  company_id: "",
  stage: "lead" as Deal["stage"],
  amount: "0",
  currency: "USD",
  probability: 10,
  priority: "normal" as Deal["priority"],
  expected_close_date: "",
  source: "manual" as Deal["source"],
  notes: "",
  loss_reason: "",
};

const EMPTY_ACTIVITY = {
  type: "task" as CRMActivity["type"],
  status: "open" as CRMActivity["status"],
  subject: "",
  body: "",
  outcome: "",
  due_at: "",
  contact_id: "",
  company_id: "",
  deal_id: "",
};

function displayName(contact?: Contact | null) {
  if (!contact) return "Unassigned";
  return `${contact.first_name} ${contact.last_name}`.trim();
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value?: string | null, withTime = false) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

function asLocalInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function csvValue(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function titleCase(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function CRMSelect({
  value,
  onChange,
  children,
  className = "",
  ariaLabel,
}: {
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={`h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
    >
      {children}
    </select>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{children}</label>;
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    lead: "border-slate-200 bg-slate-50 text-slate-700",
    prospect: "border-cyan-200 bg-cyan-50 text-cyan-700",
    opportunity: "border-violet-200 bg-violet-50 text-violet-700",
    customer: "border-emerald-200 bg-emerald-50 text-emerald-700",
    partner: "border-blue-200 bg-blue-50 text-blue-700",
    inactive: "border-zinc-200 bg-zinc-50 text-zinc-600",
    qualified: "border-blue-200 bg-blue-50 text-blue-700",
    proposal: "border-violet-200 bg-violet-50 text-violet-700",
    negotiation: "border-amber-200 bg-amber-50 text-amber-700",
    won: "border-emerald-200 bg-emerald-50 text-emerald-700",
    lost: "border-rose-200 bg-rose-50 text-rose-700",
    new: "border-sky-200 bg-sky-50 text-sky-700",
    contacted: "border-indigo-200 bg-indigo-50 text-indigo-700",
    nurturing: "border-amber-200 bg-amber-50 text-amber-700",
    unqualified: "border-zinc-200 bg-zinc-50 text-zinc-600",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${colors[stage] || colors.inactive}`}>
      {titleCase(stage)}
    </span>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function CRMModal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close dialog" />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-background shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-background/95 p-6 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}

export default function CRMTab() {
  const [view, setView] = useState<CRMView>("dashboard");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("open");
  const [modal, setModal] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT);
  const [companyForm, setCompanyForm] = useState(EMPTY_COMPANY);
  const [dealForm, setDealForm] = useState(EMPTY_DEAL);
  const [activityForm, setActivityForm] = useState(EMPTY_ACTIVITY);

  const loadCRM = async () => {
    setLoading(true);
    setError("");
    setSetupRequired(false);
    const [contactResult, companyResult, dealResult, activityResult] = await Promise.all([
      supabase.from("crm_contacts").select("*").order("updated_at", { ascending: false }),
      supabase.from("crm_companies").select("*").order("name"),
      supabase.from("crm_deals").select("*").order("updated_at", { ascending: false }),
      supabase.from("crm_activities").select("*").order("created_at", { ascending: false }).limit(500),
    ]);

    const crmError = contactResult.error || companyResult.error || dealResult.error || activityResult.error;
    if (crmError) {
      const missingTable = crmError.code === "42P01" || crmError.code === "PGRST205" || crmError.message.toLowerCase().includes("crm_contacts");
      setSetupRequired(missingTable);
      setError(missingTable ? "The CRM database migration has not been applied yet." : crmError.message);
      setLoading(false);
      return;
    }

    setContacts((contactResult.data || []) as Contact[]);
    setCompanies((companyResult.data || []) as Company[]);
    setDeals((dealResult.data || []) as Deal[]);
    setActivities((activityResult.data || []) as CRMActivity[]);
    setLoading(false);
  };

  useEffect(() => {
    void loadCRM();
  }, []);

  const companyById = useMemo(() => new Map(companies.map((company) => [company.id, company])), [companies]);
  const contactById = useMemo(() => new Map(contacts.map((contact) => [contact.id, contact])), [contacts]);
  const dealById = useMemo(() => new Map(deals.map((deal) => [deal.id, deal])), [deals]);
  const selectedContact = selectedContactId ? contactById.get(selectedContactId) || null : null;

  const openPipeline = deals.filter((deal) => !["won", "lost"].includes(deal.stage));
  const wonDeals = deals.filter((deal) => deal.stage === "won");
  const closedDeals = deals.filter((deal) => ["won", "lost"].includes(deal.stage));
  const wonRevenue = wonDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);
  const openPipelineValue = openPipeline.reduce((sum, deal) => sum + Number(deal.amount), 0);
  const weightedPipelineValue = openPipeline.reduce((sum, deal) => sum + Number(deal.amount) * (deal.probability / 100), 0);
  const conversionRate = closedDeals.length ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0;
  const overdueTasks = activities.filter(
    (item) => item.status === "open" && item.due_at && new Date(item.due_at) < new Date(),
  );
  const openTasks = activities
    .filter((item) => item.status === "open" && ["task", "meeting"].includes(item.type))
    .sort((a, b) => new Date(a.due_at || "2999").getTime() - new Date(b.due_at || "2999").getTime());

  const filteredContacts = contacts.filter((contact) => {
    const query = search.trim().toLowerCase();
    const company = contact.company_id ? companyById.get(contact.company_id) : null;
    const matchesSearch =
      !query ||
      displayName(contact).toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query) ||
      company?.name.toLowerCase().includes(query) ||
      contact.tags?.some((tag) => tag.toLowerCase().includes(query));
    return matchesSearch && (lifecycleFilter === "all" || contact.lifecycle_stage === lifecycleFilter);
  });

  const filteredCompanies = companies.filter((company) => {
    const query = search.trim().toLowerCase();
    return !query || [company.name, company.industry, company.country, company.city].some((value) => value?.toLowerCase().includes(query));
  });

  const filteredActivities = activities.filter((item) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "overdue") return item.status === "open" && !!item.due_at && new Date(item.due_at) < new Date();
    if (activityFilter === "completed") return item.status === "completed";
    return item.status === "open";
  });

  const openNewContact = () => {
    setEditingId(null);
    setContactForm(EMPTY_CONTACT);
    setModal("contact");
  };

  const openEditContact = (contact: Contact) => {
    setEditingId(contact.id);
    setContactForm({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email || "",
      phone: contact.phone || "",
      job_title: contact.job_title || "",
      company_id: contact.company_id || "",
      lifecycle_stage: contact.lifecycle_stage,
      lead_status: contact.lead_status,
      source: contact.source,
      lead_score: contact.lead_score,
      tags: (contact.tags || []).join(", "),
      marketing_opt_in: contact.marketing_opt_in,
      notes: contact.notes || "",
      next_follow_up_at: asLocalInput(contact.next_follow_up_at),
    });
    setModal("contact");
  };

  const openNewCompany = () => {
    setEditingId(null);
    setCompanyForm(EMPTY_COMPANY);
    setModal("company");
  };

  const openEditCompany = (company: Company) => {
    setEditingId(company.id);
    setCompanyForm({
      name: company.name,
      website: company.website || "",
      phone: company.phone || "",
      industry: company.industry || "",
      country: company.country || "",
      city: company.city || "",
      address: company.address || "",
      status: company.status,
      size: company.size || "",
      notes: company.notes || "",
    });
    setModal("company");
  };

  const openNewDeal = (contact?: Contact | null) => {
    setEditingId(null);
    setDealForm({
      ...EMPTY_DEAL,
      contact_id: contact?.id || "",
      company_id: contact?.company_id || "",
      title: contact ? `${displayName(contact)} opportunity` : "",
    });
    setModal("deal");
  };

  const openEditDeal = (deal: Deal) => {
    setEditingId(deal.id);
    setDealForm({
      title: deal.title,
      contact_id: deal.contact_id || "",
      company_id: deal.company_id || "",
      stage: deal.stage,
      amount: String(deal.amount),
      currency: deal.currency,
      probability: deal.probability,
      priority: deal.priority,
      expected_close_date: deal.expected_close_date || "",
      source: deal.source,
      notes: deal.notes || "",
      loss_reason: deal.loss_reason || "",
    });
    setModal("deal");
  };

  const openNewActivity = (
    presets: Partial<typeof EMPTY_ACTIVITY> = {},
  ) => {
    setEditingId(null);
    setActivityForm({ ...EMPTY_ACTIVITY, ...presets });
    setModal("activity");
  };

  const openEditActivity = (item: CRMActivity) => {
    setEditingId(item.id);
    setActivityForm({
      type: item.type,
      status: item.status,
      subject: item.subject,
      body: item.body || "",
      outcome: item.outcome || "",
      due_at: asLocalInput(item.due_at),
      contact_id: item.contact_id || "",
      company_id: item.company_id || "",
      deal_id: item.deal_id || "",
    });
    setModal("activity");
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setEditingId(null);
  };

  const saveContact = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!contactForm.first_name.trim()) return toast.error("First name is required.");
    if (contactForm.email && !contactForm.email.includes("@")) return toast.error("Enter a valid email address.");
    setSaving(true);
    const payload = {
      first_name: contactForm.first_name.trim(),
      last_name: contactForm.last_name.trim(),
      email: contactForm.email.trim().toLowerCase() || null,
      phone: contactForm.phone.trim() || null,
      job_title: contactForm.job_title.trim() || null,
      company_id: contactForm.company_id || null,
      lifecycle_stage: contactForm.lifecycle_stage,
      lead_status: contactForm.lead_status,
      source: contactForm.source,
      lead_score: Number(contactForm.lead_score) || 0,
      tags: contactForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      marketing_opt_in: contactForm.marketing_opt_in,
      notes: contactForm.notes.trim() || null,
      next_follow_up_at: contactForm.next_follow_up_at ? new Date(contactForm.next_follow_up_at).toISOString() : null,
    };
    const result = editingId
      ? await supabase.from("crm_contacts").update(payload).eq("id", editingId)
      : await supabase.from("crm_contacts").insert(payload);
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(editingId ? "Contact updated." : "Contact added.");
    closeModal();
    await loadCRM();
  };

  const saveCompany = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!companyForm.name.trim()) return toast.error("Company name is required.");
    setSaving(true);
    const payload = {
      name: companyForm.name.trim(),
      website: companyForm.website.trim() || null,
      phone: companyForm.phone.trim() || null,
      industry: companyForm.industry.trim() || null,
      country: companyForm.country.trim() || null,
      city: companyForm.city.trim() || null,
      address: companyForm.address.trim() || null,
      status: companyForm.status,
      size: companyForm.size || null,
      notes: companyForm.notes.trim() || null,
    };
    const result = editingId
      ? await supabase.from("crm_companies").update(payload).eq("id", editingId)
      : await supabase.from("crm_companies").insert(payload);
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(editingId ? "Company updated." : "Company added.");
    closeModal();
    await loadCRM();
  };

  const saveDeal = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dealForm.title.trim()) return toast.error("Deal title is required.");
    setSaving(true);
    const isClosed = ["won", "lost"].includes(dealForm.stage);
    const payload = {
      title: dealForm.title.trim(),
      contact_id: dealForm.contact_id || null,
      company_id: dealForm.company_id || null,
      stage: dealForm.stage,
      amount: Number(dealForm.amount) || 0,
      currency: dealForm.currency.toUpperCase(),
      probability: Number(dealForm.probability) || 0,
      priority: dealForm.priority,
      expected_close_date: dealForm.expected_close_date || null,
      source: dealForm.source,
      notes: dealForm.notes.trim() || null,
      loss_reason: dealForm.stage === "lost" ? dealForm.loss_reason.trim() || null : null,
      closed_at: isClosed ? new Date().toISOString() : null,
    };
    const result = editingId
      ? await supabase.from("crm_deals").update(payload).eq("id", editingId)
      : await supabase.from("crm_deals").insert(payload);
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(editingId ? "Deal updated." : "Deal added to the pipeline.");
    closeModal();
    await loadCRM();
  };

  const saveActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityForm.subject.trim()) return toast.error("Subject is required.");
    setSaving(true);
    const status = activityForm.type === "note" && !editingId ? "completed" : activityForm.status;
    const payload = {
      type: activityForm.type,
      status,
      subject: activityForm.subject.trim(),
      body: activityForm.body.trim() || null,
      outcome: activityForm.outcome.trim() || null,
      due_at: activityForm.due_at ? new Date(activityForm.due_at).toISOString() : null,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      contact_id: activityForm.contact_id || null,
      company_id: activityForm.company_id || null,
      deal_id: activityForm.deal_id || null,
    };
    const result = editingId
      ? await supabase.from("crm_activities").update(payload).eq("id", editingId)
      : await supabase.from("crm_activities").insert(payload);
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(editingId ? "Activity updated." : "Activity recorded.");
    closeModal();
    await loadCRM();
  };

  const updateDealStage = async (deal: Deal, stage: Deal["stage"]) => {
    const stageConfig = DEAL_STAGES.find((item) => item.id === stage)!;
    const result = await supabase
      .from("crm_deals")
      .update({
        stage,
        probability: stageConfig.probability,
        closed_at: ["won", "lost"].includes(stage) ? new Date().toISOString() : null,
      })
      .eq("id", deal.id);
    if (result.error) return toast.error(result.error.message);
    setDeals((current) => current.map((item) => (
      item.id === deal.id
        ? { ...item, stage, probability: stageConfig.probability, closed_at: ["won", "lost"].includes(stage) ? new Date().toISOString() : null }
        : item
    )));
    toast.success(`Moved to ${stageConfig.label}.`);
  };

  const completeActivity = async (item: CRMActivity) => {
    const status = item.status === "completed" ? "open" : "completed";
    const result = await supabase
      .from("crm_activities")
      .update({ status, completed_at: status === "completed" ? new Date().toISOString() : null })
      .eq("id", item.id);
    if (result.error) return toast.error(result.error.message);
    setActivities((current) => current.map((activityItem) => (
      activityItem.id === item.id
        ? { ...activityItem, status, completed_at: status === "completed" ? new Date().toISOString() : null }
        : activityItem
    )));
  };

  const deleteRecord = async (table: "crm_contacts" | "crm_companies" | "crm_deals" | "crm_activities", id: string, label: string) => {
    if (!window.confirm(`Delete this ${label}? This action cannot be undone.`)) return false;
    const result = await supabase.from(table).delete().eq("id", id);
    if (result.error) {
      toast.error(result.error.message);
      return false;
    }
    if (table === "crm_contacts") {
      setContacts((current) => current.filter((item) => item.id !== id));
      if (selectedContactId === id) setSelectedContactId(null);
    }
    if (table === "crm_companies") setCompanies((current) => current.filter((item) => item.id !== id));
    if (table === "crm_deals") setDeals((current) => current.filter((item) => item.id !== id));
    if (table === "crm_activities") setActivities((current) => current.filter((item) => item.id !== id));
    toast.success(`${titleCase(label)} deleted.`);
    return true;
  };

  const exportContacts = () => {
    const rows = [
      ["First name", "Last name", "Email", "Phone", "Company", "Lifecycle", "Lead status", "Score", "Source", "Tags"],
      ...filteredContacts.map((contact) => [
        contact.first_name,
        contact.last_name,
        contact.email,
        contact.phone,
        contact.company_id ? companyById.get(contact.company_id)?.name : "",
        contact.lifecycle_stage,
        contact.lead_status,
        contact.lead_score,
        contact.source,
        contact.tags.join("; "),
      ]),
    ];
    const blob = new Blob([rows.map((row) => row.map(csvValue).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `crm-contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your customer workspace…</p>
      </div>
    );
  }

  if (setupRequired) {
    return (
      <EmptyState
        icon={Sparkles}
        title="CRM is ready to be activated"
        description="Apply the included CRM database migration, then refresh this page. Existing orders, quotes, distributor applications, and messages will be organized automatically."
        action={<Button onClick={loadCRM}><RefreshCw className="mr-2 h-4 w-4" />Check again</Button>}
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="CRM data could not be loaded"
        description={error}
        action={<Button onClick={loadCRM}><RefreshCw className="mr-2 h-4 w-4" />Try again</Button>}
      />
    );
  }

  const navItems: Array<{ id: CRMView; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "contacts", label: "Contacts", icon: Users, count: contacts.length },
    { id: "companies", label: "Companies", icon: Building2, count: companies.length },
    { id: "pipeline", label: "Pipeline", icon: BriefcaseBusiness, count: openPipeline.length },
    { id: "activities", label: "Activities", icon: ListTodo, count: openTasks.length },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">Customer 360</span>
              {overdueTasks.length > 0 && (
                <button onClick={() => { setActivityFilter("overdue"); setView("activities"); }} className="text-xs font-medium text-rose-600 hover:underline">
                  {overdueTasks.length} overdue
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Customer relationships</h2>
            <p className="mt-1 text-sm text-muted-foreground">One workspace for every relationship, deal, and follow-up.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openNewActivity()}>
              <CalendarClock className="mr-2 h-4 w-4" />Add activity
            </Button>
            <Button variant="outline" onClick={() => openNewDeal()}>
              <CircleDollarSign className="mr-2 h-4 w-4" />New deal
            </Button>
            <Button onClick={openNewContact}>
              <Plus className="mr-2 h-4 w-4" />New contact
            </Button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t bg-muted/20 p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                view === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.count !== undefined && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{item.count}</span>}
            </button>
          ))}
          <Button variant="ghost" size="icon" className="ml-auto shrink-0" onClick={loadCRM} title="Refresh CRM">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </section>

      {view === "dashboard" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Open pipeline", value: formatMoney(openPipelineValue), detail: `${openPipeline.length} active deals`, icon: CircleDollarSign, iconClass: "bg-blue-500/10 text-blue-600" },
              { label: "Weighted forecast", value: formatMoney(weightedPipelineValue), detail: "Probability adjusted", icon: TrendingUp, iconClass: "bg-violet-500/10 text-violet-600" },
              { label: "Won revenue", value: formatMoney(wonRevenue), detail: `${wonDeals.length} closed-won deals`, icon: Target, iconClass: "bg-emerald-500/10 text-emerald-600" },
              { label: "Win rate", value: `${conversionRate}%`, detail: `${closedDeals.length} closed deals`, icon: CheckCircle2, iconClass: "bg-amber-500/10 text-amber-600" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${metric.iconClass}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-2xl font-bold">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-bold">Pipeline health</h3>
                  <p className="text-xs text-muted-foreground">Value and volume by sales stage</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setView("pipeline")}>View pipeline<ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
              <div className="space-y-5 p-5">
                {DEAL_STAGES.filter((stage) => !["won", "lost"].includes(stage.id)).map((stage) => {
                  const stageDeals = deals.filter((deal) => deal.stage === stage.id);
                  const stageValue = stageDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);
                  const width = openPipelineValue ? Math.max(4, (stageValue / openPipelineValue) * 100) : 0;
                  return (
                    <div key={stage.id}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium"><span className={`h-2 w-2 rounded-full ${stage.color}`} />{stage.label}</span>
                        <span><strong>{formatMoney(stageValue)}</strong><span className="ml-2 text-xs text-muted-foreground">{stageDeals.length} deals</span></span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
                {openPipeline.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Add a deal to start forecasting your pipeline.</p>}
              </div>
            </section>

            <section className="rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-bold">Next actions</h3>
                  <p className="text-xs text-muted-foreground">Tasks and meetings that need attention</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openNewActivity()}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="divide-y">
                {openTasks.slice(0, 6).map((item) => {
                  const isOverdue = !!item.due_at && new Date(item.due_at) < new Date();
                  return (
                    <div key={item.id} className="flex items-start gap-3 p-4">
                      <button
                        onClick={() => completeActivity(item)}
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-transparent hover:border-primary hover:text-primary"
                        aria-label={`Complete ${item.subject}`}
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.subject}</p>
                        <p className={`mt-1 text-xs ${isOverdue ? "font-medium text-rose-600" : "text-muted-foreground"}`}>
                          {item.due_at ? formatDate(item.due_at, true) : "No due date"}
                          {item.contact_id && ` · ${displayName(contactById.get(item.contact_id))}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {openTasks.length === 0 && <p className="p-10 text-center text-sm text-muted-foreground">You are all caught up.</p>}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="font-bold">Recent relationship activity</h3>
                <p className="text-xs text-muted-foreground">Latest notes, calls, emails, meetings, and tasks</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView("activities")}>View all<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
            <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
              {activities.slice(0, 4).map((item) => (
                <div key={item.id} className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <ActivityTypeIcon type={item.type} />
                    <span className="text-[10px] text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                  <p className="line-clamp-1 text-sm font-bold">{item.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.body || item.outcome || "No additional details"}</p>
                  {item.contact_id && <button onClick={() => setSelectedContactId(item.contact_id)} className="mt-3 text-xs font-medium text-primary hover:underline">{displayName(contactById.get(item.contact_id))}</button>}
                </div>
              ))}
              {activities.length === 0 && <p className="col-span-full p-10 text-center text-sm text-muted-foreground">No activity has been recorded yet.</p>}
            </div>
          </section>
        </div>
      )}

      {view === "contacts" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, company, phone, or tag…" className="pl-10" />
            </div>
            <div className="flex gap-2">
              <CRMSelect value={lifecycleFilter} onChange={(event) => setLifecycleFilter(event.target.value)} ariaLabel="Filter by lifecycle stage">
                <option value="all">All lifecycle stages</option>
                {LIFECYCLE_STAGES.map((stage) => <option key={stage} value={stage}>{titleCase(stage)}</option>)}
              </CRMSelect>
              <Button variant="outline" size="icon" onClick={exportContacts} title="Export filtered contacts"><Download className="h-4 w-4" /></Button>
              <Button onClick={openNewContact}><Plus className="mr-2 h-4 w-4" />Add contact</Button>
            </div>
          </div>

          {filteredContacts.length ? (
            <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Lifecycle</th>
                    <th className="px-5 py-3 font-medium">Lead status</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium">Next follow-up</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="cursor-pointer transition hover:bg-muted/30" onClick={() => setSelectedContactId(contact.id)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                            {contact.first_name[0]}{contact.last_name?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-bold">{displayName(contact)}</p>
                            <p className="text-xs text-muted-foreground">{contact.email || contact.phone || "No contact details"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{contact.company_id ? companyById.get(contact.company_id)?.name || "Unknown" : "—"}</p>
                        <p className="text-xs text-muted-foreground">{contact.job_title || "No title"}</p>
                      </td>
                      <td className="px-5 py-4"><StageBadge stage={contact.lifecycle_stage} /></td>
                      <td className="px-5 py-4 text-xs font-medium">{titleCase(contact.lead_status)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${contact.lead_score}%` }} /></div>
                          <span className="text-xs font-bold">{contact.lead_score}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-xs ${contact.next_follow_up_at && new Date(contact.next_follow_up_at) < new Date() ? "font-medium text-rose-600" : "text-muted-foreground"}`}>
                        {formatDate(contact.next_follow_up_at)}
                      </td>
                      <td className="px-5 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => openEditContact(contact)}><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteRecord("crm_contacts", contact.id, "contact")}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={UserRound}
              title={contacts.length ? "No contacts match your filters" : "Build your customer database"}
              description={contacts.length ? "Try a different search term or lifecycle stage." : "Add the people your team sells to, supports, and partners with."}
              action={!contacts.length ? <Button onClick={openNewContact}><Plus className="mr-2 h-4 w-4" />Add first contact</Button> : undefined}
            />
          )}
        </div>
      )}

      {view === "companies" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search companies, industries, or locations…" className="pl-10" />
            </div>
            <Button onClick={openNewCompany}><Plus className="mr-2 h-4 w-4" />Add company</Button>
          </div>
          {filteredCompanies.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCompanies.map((company) => {
                const companyContacts = contacts.filter((contact) => contact.company_id === company.id);
                const companyDeals = deals.filter((deal) => deal.company_id === company.id);
                const activeValue = companyDeals.filter((deal) => !["won", "lost"].includes(deal.stage)).reduce((sum, deal) => sum + Number(deal.amount), 0);
                return (
                  <article key={company.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600"><Building2 className="h-5 w-5" /></div>
                      <div>
                        <Button variant="ghost" size="icon" onClick={() => openEditCompany(company)}><Edit3 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteRecord("crm_companies", company.id, "company")}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{company.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{company.industry || "Industry not set"}{company.country ? ` · ${company.country}` : ""}</p>
                    <div className="mt-4"><StageBadge stage={company.status} /></div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Contacts</p>
                        <p className="mt-1 text-lg font-bold">{companyContacts.length}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Open pipeline</p>
                        <p className="mt-1 text-lg font-bold">{formatMoney(activeValue)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {company.phone && <a href={`tel:${company.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="h-3.5 w-3.5" />{company.phone}</a>}
                      {company.website && <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" />Website</a>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title={companies.length ? "No companies match your search" : "Organize contacts by company"}
              description={companies.length ? "Try a broader company, industry, or location search." : "Track accounts, partners, and prospects with their related contacts and opportunities."}
              action={!companies.length ? <Button onClick={openNewCompany}><Plus className="mr-2 h-4 w-4" />Add first company</Button> : undefined}
            />
          )}
        </div>
      )}

      {view === "pipeline" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold">Sales pipeline</h3>
              <p className="text-sm text-muted-foreground">{formatMoney(openPipelineValue)} open · {formatMoney(weightedPipelineValue)} weighted forecast</p>
            </div>
            <Button onClick={() => openNewDeal()}><Plus className="mr-2 h-4 w-4" />Add deal</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {DEAL_STAGES.map((stage) => {
              const stageDeals = deals.filter((deal) => deal.stage === stage.id);
              const stageValue = stageDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);
              return (
                <section key={stage.id} className="w-[19rem] shrink-0 rounded-2xl border bg-muted/20">
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-sm font-bold"><span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />{stage.label}</h4>
                      <span className="rounded-full bg-background px-2 py-0.5 text-xs">{stageDeals.length}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{formatMoney(stageValue)}</p>
                  </div>
                  <div className="min-h-48 space-y-3 p-3">
                    {stageDeals.map((deal) => (
                      <article key={deal.id} className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <button className="text-left" onClick={() => openEditDeal(deal)}>
                            <p className="line-clamp-2 text-sm font-bold hover:text-primary">{deal.title}</p>
                          </button>
                          {deal.priority === "high" && <span title="High priority" className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />}
                        </div>
                        <p className="mt-2 text-lg font-bold">{formatMoney(deal.amount, deal.currency)}</p>
                        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                          {deal.contact_id && <p className="truncate"><UserRound className="mr-1 inline h-3.5 w-3.5" />{displayName(contactById.get(deal.contact_id))}</p>}
                          <p><CalendarClock className="mr-1 inline h-3.5 w-3.5" />{formatDate(deal.expected_close_date)}</p>
                        </div>
                        <div className="mt-3 border-t pt-3">
                          <CRMSelect
                            value={deal.stage}
                            onChange={(event) => updateDealStage(deal, event.target.value as Deal["stage"])}
                            className="w-full text-xs"
                            ariaLabel={`Move ${deal.title} to another stage`}
                          >
                            {DEAL_STAGES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                          </CRMSelect>
                        </div>
                      </article>
                    ))}
                    {stageDeals.length === 0 && <p className="py-10 text-center text-xs text-muted-foreground">No deals</p>}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {view === "activities" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: "open", label: "Open", count: openTasks.length },
                { id: "overdue", label: "Overdue", count: overdueTasks.length },
                { id: "completed", label: "Completed" },
                { id: "all", label: "All activity" },
              ].map((filter) => (
                <Button key={filter.id} variant={activityFilter === filter.id ? "default" : "outline"} size="sm" onClick={() => setActivityFilter(filter.id)}>
                  {filter.label}{filter.count !== undefined ? ` (${filter.count})` : ""}
                </Button>
              ))}
            </div>
            <Button onClick={() => openNewActivity()}><Plus className="mr-2 h-4 w-4" />Add activity</Button>
          </div>

          {filteredActivities.length ? (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="divide-y">
                {filteredActivities.map((item) => {
                  const isOverdue = item.status === "open" && !!item.due_at && new Date(item.due_at) < new Date();
                  const contact = item.contact_id ? contactById.get(item.contact_id) : null;
                  const deal = item.deal_id ? dealById.get(item.deal_id) : null;
                  return (
                    <article key={item.id} className="flex gap-4 p-5 hover:bg-muted/20">
                      {["task", "meeting"].includes(item.type) ? (
                        <button
                          onClick={() => completeActivity(item)}
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${item.status === "completed" ? "border-emerald-500 bg-emerald-500 text-white" : "text-transparent hover:border-primary hover:text-primary"}`}
                          aria-label={item.status === "completed" ? "Reopen activity" : "Complete activity"}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      ) : <ActivityTypeIcon type={item.type} />}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className={`font-bold ${item.status === "completed" && item.type === "task" ? "text-muted-foreground line-through" : ""}`}>{item.subject}</h4>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">{titleCase(item.type)}</span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {contact && <button className="font-medium text-primary hover:underline" onClick={() => setSelectedContactId(contact.id)}>{displayName(contact)}</button>}
                              {contact && deal ? " · " : ""}
                              {deal?.title}
                              {!contact && !deal ? "General CRM activity" : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`mr-2 text-xs ${isOverdue ? "font-bold text-rose-600" : "text-muted-foreground"}`}>
                              {item.due_at ? formatDate(item.due_at, true) : formatDate(item.created_at, true)}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => openEditActivity(item)}><Edit3 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteRecord("crm_activities", item.id, "activity")}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        {item.body && <p className="mt-3 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{item.body}</p>}
                        {item.outcome && <p className="mt-2 text-sm"><span className="font-medium">Outcome:</span> {item.outcome}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Nothing in this activity view"
              description="Record a note, call, email, meeting, or task to keep the relationship history complete."
              action={<Button onClick={() => openNewActivity()}><Plus className="mr-2 h-4 w-4" />Add activity</Button>}
            />
          )}
        </div>
      )}

      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          company={selectedContact.company_id ? companyById.get(selectedContact.company_id) || null : null}
          deals={deals.filter((deal) => deal.contact_id === selectedContact.id)}
          activities={activities.filter((item) => item.contact_id === selectedContact.id)}
          onClose={() => setSelectedContactId(null)}
          onEdit={() => openEditContact(selectedContact)}
          onAddDeal={() => openNewDeal(selectedContact)}
          onAddActivity={(type) => openNewActivity({ type, contact_id: selectedContact.id, company_id: selectedContact.company_id || "", status: type === "note" ? "completed" : "open" })}
        />
      )}

      {modal === "contact" && (
        <CRMModal title={editingId ? "Edit contact" : "Add contact"} description="Maintain a complete customer profile for sales and service." onClose={closeModal}>
          <form onSubmit={saveContact} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><FieldLabel>First name *</FieldLabel><Input value={contactForm.first_name} onChange={(event) => setContactForm({ ...contactForm, first_name: event.target.value })} autoFocus /></div>
              <div><FieldLabel>Last name</FieldLabel><Input value={contactForm.last_name} onChange={(event) => setContactForm({ ...contactForm, last_name: event.target.value })} /></div>
              <div><FieldLabel>Email</FieldLabel><Input type="email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} /></div>
              <div><FieldLabel>Phone</FieldLabel><Input value={contactForm.phone} onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })} /></div>
              <div><FieldLabel>Job title</FieldLabel><Input value={contactForm.job_title} onChange={(event) => setContactForm({ ...contactForm, job_title: event.target.value })} /></div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <CRMSelect value={contactForm.company_id} onChange={(event) => setContactForm({ ...contactForm, company_id: event.target.value })} className="w-full">
                  <option value="">No company</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Lifecycle stage</FieldLabel>
                <CRMSelect value={contactForm.lifecycle_stage} onChange={(event) => setContactForm({ ...contactForm, lifecycle_stage: event.target.value as Contact["lifecycle_stage"] })} className="w-full">
                  {LIFECYCLE_STAGES.map((stage) => <option key={stage} value={stage}>{titleCase(stage)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Lead status</FieldLabel>
                <CRMSelect value={contactForm.lead_status} onChange={(event) => setContactForm({ ...contactForm, lead_status: event.target.value as Contact["lead_status"] })} className="w-full">
                  {LEAD_STATUSES.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Source</FieldLabel>
                <CRMSelect value={contactForm.source} onChange={(event) => setContactForm({ ...contactForm, source: event.target.value as Contact["source"] })} className="w-full">
                  {SOURCES.map((source) => <option key={source} value={source}>{titleCase(source)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Lead score (0–100)</FieldLabel>
                <Input type="number" min={0} max={100} value={contactForm.lead_score} onChange={(event) => setContactForm({ ...contactForm, lead_score: Number(event.target.value) })} />
              </div>
              <div>
                <FieldLabel>Next follow-up</FieldLabel>
                <Input type="datetime-local" value={contactForm.next_follow_up_at} onChange={(event) => setContactForm({ ...contactForm, next_follow_up_at: event.target.value })} />
              </div>
              <div><FieldLabel>Tags (comma separated)</FieldLabel><Input value={contactForm.tags} onChange={(event) => setContactForm({ ...contactForm, tags: event.target.value })} placeholder="VIP, wholesale, APAC" /></div>
            </div>
            <div><FieldLabel>Internal notes</FieldLabel><Textarea rows={4} value={contactForm.notes} onChange={(event) => setContactForm({ ...contactForm, notes: event.target.value })} /></div>
            <label className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3 text-sm">
              <input type="checkbox" checked={contactForm.marketing_opt_in} onChange={(event) => setContactForm({ ...contactForm, marketing_opt_in: event.target.checked })} className="h-4 w-4 accent-primary" />
              Contact has opted in to marketing communications
            </label>
            <div className="flex justify-end gap-2 border-t pt-5"><Button type="button" variant="outline" onClick={closeModal}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? "Save changes" : "Add contact"}</Button></div>
          </form>
        </CRMModal>
      )}

      {modal === "company" && (
        <CRMModal title={editingId ? "Edit company" : "Add company"} description="Track an account, partner, or prospect organization." onClose={closeModal}>
          <form onSubmit={saveCompany} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><FieldLabel>Company name *</FieldLabel><Input value={companyForm.name} onChange={(event) => setCompanyForm({ ...companyForm, name: event.target.value })} autoFocus /></div>
              <div><FieldLabel>Website</FieldLabel><Input value={companyForm.website} onChange={(event) => setCompanyForm({ ...companyForm, website: event.target.value })} placeholder="https://example.com" /></div>
              <div><FieldLabel>Phone</FieldLabel><Input value={companyForm.phone} onChange={(event) => setCompanyForm({ ...companyForm, phone: event.target.value })} /></div>
              <div><FieldLabel>Industry</FieldLabel><Input value={companyForm.industry} onChange={(event) => setCompanyForm({ ...companyForm, industry: event.target.value })} /></div>
              <div>
                <FieldLabel>Company size</FieldLabel>
                <CRMSelect value={companyForm.size || ""} onChange={(event) => setCompanyForm({ ...companyForm, size: event.target.value as Company["size"] | "" })} className="w-full">
                  <option value="">Not specified</option>
                  {["solo", "small", "medium", "large", "enterprise"].map((size) => <option key={size} value={size}>{titleCase(size)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Relationship</FieldLabel>
                <CRMSelect value={companyForm.status} onChange={(event) => setCompanyForm({ ...companyForm, status: event.target.value as Company["status"] })} className="w-full">
                  {["prospect", "customer", "partner", "inactive"].map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
                </CRMSelect>
              </div>
              <div><FieldLabel>Country</FieldLabel><Input value={companyForm.country} onChange={(event) => setCompanyForm({ ...companyForm, country: event.target.value })} /></div>
              <div><FieldLabel>City</FieldLabel><Input value={companyForm.city} onChange={(event) => setCompanyForm({ ...companyForm, city: event.target.value })} /></div>
              <div className="sm:col-span-2"><FieldLabel>Address</FieldLabel><Input value={companyForm.address} onChange={(event) => setCompanyForm({ ...companyForm, address: event.target.value })} /></div>
            </div>
            <div><FieldLabel>Internal notes</FieldLabel><Textarea rows={4} value={companyForm.notes} onChange={(event) => setCompanyForm({ ...companyForm, notes: event.target.value })} /></div>
            <div className="flex justify-end gap-2 border-t pt-5"><Button type="button" variant="outline" onClick={closeModal}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? "Save changes" : "Add company"}</Button></div>
          </form>
        </CRMModal>
      )}

      {modal === "deal" && (
        <CRMModal title={editingId ? "Edit deal" : "Add deal"} description="Create and forecast a revenue opportunity." onClose={closeModal}>
          <form onSubmit={saveDeal} className="space-y-5">
            <div><FieldLabel>Deal title *</FieldLabel><Input value={dealForm.title} onChange={(event) => setDealForm({ ...dealForm, title: event.target.value })} autoFocus /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Contact</FieldLabel>
                <CRMSelect value={dealForm.contact_id} onChange={(event) => {
                  const contact = contactById.get(event.target.value);
                  setDealForm({ ...dealForm, contact_id: event.target.value, company_id: contact?.company_id || dealForm.company_id });
                }} className="w-full">
                  <option value="">No contact</option>
                  {contacts.map((contact) => <option key={contact.id} value={contact.id}>{displayName(contact)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <CRMSelect value={dealForm.company_id} onChange={(event) => setDealForm({ ...dealForm, company_id: event.target.value })} className="w-full">
                  <option value="">No company</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Stage</FieldLabel>
                <CRMSelect value={dealForm.stage} onChange={(event) => {
                  const stage = event.target.value as Deal["stage"];
                  setDealForm({ ...dealForm, stage, probability: DEAL_STAGES.find((item) => item.id === stage)?.probability ?? dealForm.probability });
                }} className="w-full">
                  {DEAL_STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Expected close</FieldLabel>
                <Input type="date" value={dealForm.expected_close_date} onChange={(event) => setDealForm({ ...dealForm, expected_close_date: event.target.value })} />
              </div>
              <div>
                <FieldLabel>Value</FieldLabel>
                <div className="flex">
                  <Input value={dealForm.currency} maxLength={3} onChange={(event) => setDealForm({ ...dealForm, currency: event.target.value.toUpperCase() })} className="w-20 rounded-r-none" aria-label="Currency" />
                  <Input type="number" min={0} step="0.01" value={dealForm.amount} onChange={(event) => setDealForm({ ...dealForm, amount: event.target.value })} className="rounded-l-none border-l-0" aria-label="Deal value" />
                </div>
              </div>
              <div><FieldLabel>Probability (%)</FieldLabel><Input type="number" min={0} max={100} value={dealForm.probability} onChange={(event) => setDealForm({ ...dealForm, probability: Number(event.target.value) })} /></div>
              <div>
                <FieldLabel>Priority</FieldLabel>
                <CRMSelect value={dealForm.priority} onChange={(event) => setDealForm({ ...dealForm, priority: event.target.value as Deal["priority"] })} className="w-full">
                  {["low", "normal", "high"].map((priority) => <option key={priority} value={priority}>{titleCase(priority)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Source</FieldLabel>
                <CRMSelect value={dealForm.source} onChange={(event) => setDealForm({ ...dealForm, source: event.target.value as Deal["source"] })} className="w-full">
                  {SOURCES.map((source) => <option key={source} value={source}>{titleCase(source)}</option>)}
                </CRMSelect>
              </div>
            </div>
            {dealForm.stage === "lost" && <div><FieldLabel>Loss reason</FieldLabel><Input value={dealForm.loss_reason} onChange={(event) => setDealForm({ ...dealForm, loss_reason: event.target.value })} /></div>}
            <div><FieldLabel>Deal notes</FieldLabel><Textarea rows={4} value={dealForm.notes} onChange={(event) => setDealForm({ ...dealForm, notes: event.target.value })} /></div>
            <div className="flex items-center justify-between border-t pt-5">
              <div>{editingId && <Button type="button" variant="ghost" className="text-destructive" onClick={async () => { if (await deleteRecord("crm_deals", editingId, "deal")) closeModal(); }}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>}</div>
              <div className="flex gap-2"><Button type="button" variant="outline" onClick={closeModal}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? "Save changes" : "Add deal"}</Button></div>
            </div>
          </form>
        </CRMModal>
      )}

      {modal === "activity" && (
        <CRMModal title={editingId ? "Edit activity" : "Add activity"} description="Keep the relationship timeline complete and actionable." onClose={closeModal}>
          <form onSubmit={saveActivity} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Activity type</FieldLabel>
                <CRMSelect value={activityForm.type} onChange={(event) => {
                  const type = event.target.value as CRMActivity["type"];
                  setActivityForm({ ...activityForm, type, status: type === "note" ? "completed" : activityForm.status });
                }} className="w-full">
                  {ACTIVITY_TYPES.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <CRMSelect value={activityForm.status} onChange={(event) => setActivityForm({ ...activityForm, status: event.target.value as CRMActivity["status"] })} className="w-full">
                  {["open", "completed", "cancelled"].map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
                </CRMSelect>
              </div>
              <div className="sm:col-span-2"><FieldLabel>Subject *</FieldLabel><Input value={activityForm.subject} onChange={(event) => setActivityForm({ ...activityForm, subject: event.target.value })} autoFocus /></div>
              <div>
                <FieldLabel>Contact</FieldLabel>
                <CRMSelect value={activityForm.contact_id} onChange={(event) => {
                  const contact = contactById.get(event.target.value);
                  setActivityForm({ ...activityForm, contact_id: event.target.value, company_id: contact?.company_id || activityForm.company_id });
                }} className="w-full">
                  <option value="">No contact</option>
                  {contacts.map((contact) => <option key={contact.id} value={contact.id}>{displayName(contact)}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Company</FieldLabel>
                <CRMSelect value={activityForm.company_id} onChange={(event) => setActivityForm({ ...activityForm, company_id: event.target.value })} className="w-full">
                  <option value="">No company</option>
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </CRMSelect>
              </div>
              <div>
                <FieldLabel>Related deal</FieldLabel>
                <CRMSelect value={activityForm.deal_id} onChange={(event) => setActivityForm({ ...activityForm, deal_id: event.target.value })} className="w-full">
                  <option value="">No deal</option>
                  {deals.map((deal) => <option key={deal.id} value={deal.id}>{deal.title}</option>)}
                </CRMSelect>
              </div>
              <div><FieldLabel>Due date</FieldLabel><Input type="datetime-local" value={activityForm.due_at} onChange={(event) => setActivityForm({ ...activityForm, due_at: event.target.value })} /></div>
            </div>
            <div><FieldLabel>Details</FieldLabel><Textarea rows={5} value={activityForm.body} onChange={(event) => setActivityForm({ ...activityForm, body: event.target.value })} placeholder="Discussion notes, agenda, or task instructions…" /></div>
            <div><FieldLabel>Outcome</FieldLabel><Input value={activityForm.outcome} onChange={(event) => setActivityForm({ ...activityForm, outcome: event.target.value })} placeholder="Optional result or next step" /></div>
            <div className="flex justify-end gap-2 border-t pt-5"><Button type="button" variant="outline" onClick={closeModal}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? "Save changes" : "Record activity"}</Button></div>
          </form>
        </CRMModal>
      )}
    </div>
  );
}

function ActivityTypeIcon({ type }: { type: CRMActivity["type"] }) {
  const config = {
    note: { icon: MessageSquareText, className: "bg-violet-500/10 text-violet-600" },
    email: { icon: Mail, className: "bg-blue-500/10 text-blue-600" },
    call: { icon: Phone, className: "bg-emerald-500/10 text-emerald-600" },
    meeting: { icon: Users, className: "bg-amber-500/10 text-amber-600" },
    task: { icon: ClipboardList, className: "bg-slate-500/10 text-slate-600" },
    status_change: { icon: MoreHorizontal, className: "bg-zinc-500/10 text-zinc-600" },
  }[type];
  const Icon = config.icon;
  return <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.className}`}><Icon className="h-4 w-4" /></div>;
}

function ContactDrawer({
  contact,
  company,
  deals,
  activities,
  onClose,
  onEdit,
  onAddDeal,
  onAddActivity,
}: {
  contact: Contact;
  company: Company | null;
  deals: Deal[];
  activities: CRMActivity[];
  onClose: () => void;
  onEdit: () => void;
  onAddDeal: () => void;
  onAddActivity: (type: CRMActivity["type"]) => void;
}) {
  return (
    <div className="fixed inset-0 z-[70]">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close contact details" />
      <aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-5 backdrop-blur">
          <p className="text-sm font-bold">Contact details</p>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}><Edit3 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {contact.first_name[0]}{contact.last_name?.[0] || ""}
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold">{displayName(contact)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{contact.job_title || "No title"}{company ? ` at ${company.name}` : ""}</p>
              <div className="mt-3 flex flex-wrap gap-2"><StageBadge stage={contact.lifecycle_stage} /><StageBadge stage={contact.lead_status} /></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-3 rounded-xl border p-3 text-sm hover:bg-muted/30"><Mail className="h-4 w-4 text-muted-foreground" /><span className="truncate">{contact.email}</span></a>}
            {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-3 rounded-xl border p-3 text-sm hover:bg-muted/30"><Phone className="h-4 w-4 text-muted-foreground" /><span className="truncate">{contact.phone}</span></a>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => onAddActivity("note")}><MessageSquareText className="mr-2 h-4 w-4" />Note</Button>
            <Button variant="outline" size="sm" onClick={() => onAddActivity("call")}><Phone className="mr-2 h-4 w-4" />Call</Button>
            <Button variant="outline" size="sm" onClick={() => onAddActivity("task")}><ClipboardList className="mr-2 h-4 w-4" />Task</Button>
          </div>

          <section className="rounded-2xl border">
            <div className="border-b p-4"><h3 className="text-sm font-bold">Profile</h3></div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 p-4 text-sm">
              <div><dt className="text-xs text-muted-foreground">Company</dt><dd className="mt-1 font-medium">{company?.name || "Not assigned"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Source</dt><dd className="mt-1 font-medium">{titleCase(contact.source)}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Lead score</dt><dd className="mt-1 font-medium">{contact.lead_score}/100</dd></div>
              <div><dt className="text-xs text-muted-foreground">Next follow-up</dt><dd className="mt-1 font-medium">{formatDate(contact.next_follow_up_at)}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted-foreground">Tags</dt><dd className="mt-2 flex flex-wrap gap-1">{contact.tags.length ? contact.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">{tag}</span>) : <span className="text-muted-foreground">No tags</span>}</dd></div>
              {contact.notes && <div className="col-span-2"><dt className="text-xs text-muted-foreground">Notes</dt><dd className="mt-1 whitespace-pre-wrap leading-6">{contact.notes}</dd></div>}
            </dl>
          </section>

          <section className="rounded-2xl border">
            <div className="flex items-center justify-between border-b p-4">
              <div><h3 className="text-sm font-bold">Deals</h3><p className="text-xs text-muted-foreground">{deals.length} opportunities</p></div>
              <Button variant="ghost" size="sm" onClick={onAddDeal}><Plus className="mr-2 h-4 w-4" />Add</Button>
            </div>
            <div className="divide-y">
              {deals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0"><p className="truncate text-sm font-medium">{deal.title}</p><div className="mt-1"><StageBadge stage={deal.stage} /></div></div>
                  <p className="shrink-0 text-sm font-bold">{formatMoney(deal.amount, deal.currency)}</p>
                </div>
              ))}
              {!deals.length && <p className="p-6 text-center text-sm text-muted-foreground">No deals linked to this contact.</p>}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div><h3 className="text-sm font-bold">Activity timeline</h3><p className="text-xs text-muted-foreground">{activities.length} recorded touchpoints</p></div>
              <Button variant="outline" size="sm" onClick={() => onAddActivity("meeting")}><Plus className="mr-2 h-4 w-4" />Add activity</Button>
            </div>
            <div className="relative space-y-4 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-border">
              {activities.map((item) => (
                <div key={item.id} className="relative flex gap-4">
                  <ActivityTypeIcon type={item.type} />
                  <div className="min-w-0 flex-1 rounded-xl border bg-card p-4">
                    <div className="flex items-start justify-between gap-3"><p className="text-sm font-bold">{item.subject}</p><span className="shrink-0 text-[10px] text-muted-foreground">{formatDate(item.created_at)}</span></div>
                    {item.body && <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.body}</p>}
                    {item.due_at && <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{formatDate(item.due_at, true)}</p>}
                  </div>
                </div>
              ))}
              {!activities.length && <p className="pl-12 text-sm text-muted-foreground">No activity recorded for this contact yet.</p>}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
