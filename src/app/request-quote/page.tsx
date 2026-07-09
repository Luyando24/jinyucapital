"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, FileText, Sparkles, Shield, Clock, HelpCircle, Loader2 } from "lucide-react";

function QuoteContent() {
  const searchParams = useSearchParams();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Street Lighting");
  const [quantity, setQuantity] = useState("10");
  const [productInterest, setProductInterest] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!searchParams) return;
    const productName = searchParams.get("product");
    const qty = searchParams.get("quantity");
    if (productName) {
      setProductInterest(decodeURIComponent(productName));
    }
    if (qty) {
      setQuantity(qty);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          email,
          phone,
          project_type: projectType,
          product_interest: productInterest,
          quantity,
          message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit quote request.');
      setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="rounded-xl p-8 md:p-12 mb-12 border border-neutral-200 bg-neutral-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
              B2B & Commercial Inquiry
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-black tracking-tight uppercase">
              Request a Project Quote
            </h1>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light">
              Submit your architectural, street, or landscape lighting requirements below. Our engineering and sales team will review your specifications and provide a competitive wholesale quote.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
            {formStatus === 'success' ? (
              <div className="flex flex-col items-center text-center gap-5 py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-primary text-white shadow-lg shadow-primary/20">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-wider text-black">
                  Quote Request Received
                </h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                  Thank you for submitting your project specifications. Our sales engineers are reviewing your request and will contact you within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setFormStatus('idle');
                    setFirstName("");
                    setLastName("");
                    setCompanyName("");
                    setEmail("");
                    setPhone("");
                    setProductInterest("");
                    setQuantity("10");
                    setMessage("");
                  }}
                  className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary text-primary transition-all pb-0.5 mt-4 hover:text-black hover:border-black"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Submit another quote request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      placeholder="Alex"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Company & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="companyName" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      required
                      placeholder="e.g. Apex Contracting Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="your@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Phone & Project Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="projectType" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      required
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 bg-white outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      <option value="Street Lighting">Street & Highway Lighting</option>
                      <option value="Landscape Lighting">Landscape & Architectural</option>
                      <option value="Industrial Lighting">Industrial Floodlights</option>
                      <option value="Custom OEM">Custom OEM/ODM Manufacturing</option>
                    </select>
                  </div>
                </div>

                {/* Product Interest & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="productInterest" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Product of Interest
                    </label>
                    <input
                      type="text"
                      id="productInterest"
                      placeholder="e.g. Venus Series Street Light"
                      value={productInterest}
                      onChange={(e) => setProductInterest(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Est. Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      required
                      min="1"
                      placeholder="e.g. 50"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Project Specifications & Details *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    placeholder="Describe your project, required certifications (CE, RoHS, UL), voltage specs, and any customization requests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formStatus === 'submitting' ? (
                    'SENDING REQUEST...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">SUBMIT QUOTE REQUEST <Send className="h-3.5 w-3.5" /></span>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Right: Info Card */}
          <div className="space-y-6">
            
            {/* Value card */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" /> Engineering Standards
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Jinyu Capital operates state-of-the-art aluminum die-casting, automated SMT lines, and photometric testing labs to ensure pro-grade durability.
              </p>
            </div>

            {/* Quality assurance */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-primary" /> Commercial Warranty
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Every commercial lighting product includes a 5-year replacement warranty, full certificate compliance support, and free local shipping coordination.
              </p>
            </div>

            {/* Response time */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-primary" /> 24-Hour Turnaround
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Our sales engineers review photometrics files, BOM requirements, and logistics paths to deliver accurate quote sheets within 1 business day.
              </p>
            </div>

            {/* General FAQs link */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-primary" /> Need Assistance?
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                For custom OEM molds or general questions about supply chain scheduling, email our support directly at <a href="mailto:sales@jinyucapital.com" className="text-primary hover:underline font-bold">sales@jinyucapital.com</a>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4 min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading quote page...</p>
      </div>
    }>
      <QuoteContent />
    </Suspense>
  );
}
