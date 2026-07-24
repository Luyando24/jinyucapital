"use client";

import { BookOpen, Download, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Getting Started",
    guides: [
      ["Dashboard Overview", "Review revenue, orders, products, low-stock alerts, and recent activity from the Overview tab."],
      ["Navigation Guide", "Use the sidebar to move between store management areas. On smaller screens, use the menu button to open it."],
    ],
  },
  {
    title: "Product Management",
    guides: [
      ["Add a Product", "Open Products, select Add Product, complete the product details, upload images, then save it to the catalogue."],
      ["Update Stock", "Find the product in Products, edit its stock quantity, and confirm the change. Low-stock alerts update automatically."],
      ["Upload Product Images", "When adding or editing a product, upload JPG, PNG, or WebP files. The first image becomes the main product image."],
    ],
  },
  {
    title: "Order Management",
    guides: [
      ["View Order Details", "Open Orders and select an order to see customer details, shipping information, items, and status."],
      ["Update Order Status", "Expand an order and choose Pending, Processing, Shipped, Delivered, or Cancelled. The change saves automatically."],
    ],
  },
  {
    title: "Customer Relationship Management",
    guides: [
      ["CRM Dashboard", "Open CRM from the left menu to review pipeline value, weighted forecast, won revenue, win rate, upcoming work, and recent customer activity."],
      ["Contacts and Companies", "Create complete contact and company profiles, assign lifecycle and lead statuses, score prospects, add tags, schedule follow-ups, and export filtered contacts to CSV."],
      ["Sales Pipeline", "Create revenue opportunities in Pipeline, assign contacts and companies, set value and closing dates, then move each deal through Lead, Qualified, Proposal, Negotiation, Won, or Lost."],
      ["Tasks and Activity History", "Record notes, calls, emails, meetings, and tasks. Mark work complete and use the Overdue view to keep follow-ups from being missed."],
    ],
  },
  {
    title: "Website Content",
    guides: [
      ["Customize the Homepage", "Use Website Content to update the hero, statistics, manufacturing section, and featured products, then save your changes."],
      ["Manage the Hero Slider", "Use Website Content to add, remove, reorder, upload, or paste URLs for hero background slides. The homepage rotates them automatically and provides visitor controls."],
      ["Upload Homepage Images", "Upload hero slider or manufacturing images, or enter direct image URLs. Check each preview before saving."],
      ["Configure Store Settings", "Use Settings to maintain store contact details, branding, social links, exchange rates, and wholesale minimum order quantity."],
    ],
  },
  {
    title: "Customer Engagement",
    guides: [
      ["Quote Requests", "Review requests in Quotes, open one for details, and update its status as the opportunity progresses."],
      ["Distributor Applications", "Review applicants in Distributors, check their business details, then mark each application as approved, rejected, or under review."],
      ["Contact Messages", "Open Contacts to read customer messages and mark them as read after review."],
      ["Newsletter Subscribers", "Manage active subscribers in Newsletter, add subscribers manually, and deactivate addresses when required."],
    ],
  },
  {
    title: "Account Management",
    guides: [
      ["Sign In", "Go to /login, enter an administrator email and password, then select Sign In."],
      ["Sign Out", "Use the account area at the bottom of the admin sidebar and select Sign Out to end the session."],
    ],
  },
] as const;

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex flex-col gap-5 rounded-2xl border bg-background p-6 sm:flex-row sm:items-center sm:justify-between print:border-0 print:p-0">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold">Jinyu Capital</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Admin User Guide</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Step-by-step guidance for managing the website. This guide is publicly available and does not require an administrator login.</p>
          </div>
          <Button onClick={() => window.print()} className="gap-2 print:hidden">
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="break-inside-avoid">
              <h2 className="mb-4 border-b pb-3 text-xl font-bold">{section.title}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {section.guides.map(([title, description]) => (
                  <article key={title} className="break-inside-avoid rounded-xl border bg-background p-5 shadow-sm print:shadow-none">
                    <h3 className="flex items-center gap-2 font-bold"><BookOpen className="h-4 w-4 text-primary" />{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-blue-900 print:break-inside-avoid">
          <h2 className="flex items-center gap-2 font-bold"><HelpCircle className="h-5 w-5" />Need additional help?</h2>
          <p className="mt-2 text-sm text-blue-800">Contact your site support team for help with anything not covered in this guide.</p>
        </section>
      </main>
      <style jsx global>{`
        @media print {
          @page { margin: 14mm; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
