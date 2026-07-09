"use client";

import React, { useState } from "react";
import { Send, FileText, Building2, User, Globe } from "lucide-react";

export default function DistributorPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Form Fields State
  const [companyName, setCompanyName] = useState("");
  const [countryRegion, setCountryRegion] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessExperience, setBusinessExperience] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const res = await fetch('/api/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          country: countryRegion,
          business_type: businessType,
          contact_name: contactPersonName,
          email,
          phone,
          experience: businessExperience,
          products: productCategories,
          message,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit application.');
      setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden bg-black text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-450 mb-6 animate-pulse"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Globe className="h-3 w-3 text-primary" /> GLOBAL PARTNERSHIP
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight uppercase">
            Become a Global Distributor
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto text-neutral-400 font-light leading-relaxed">
            Partner with Jinyu Capital to bring high-quality, innovative lighting and appliance solutions to your local market. Fill out the application below to start the conversation.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-sm">
          
          {formStatus === 'success' ? (
            <div className="flex flex-col items-center text-center gap-5 py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-primary text-white shadow-lg shadow-primary/20 animate-bounce">
                ✓
              </div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-wider text-black">
                Application Submitted
              </h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto font-light leading-relaxed">
                Thank you for applying to become a global distributor. Our international BD team will review your credentials and reach out within 2 business days.
              </p>
              <button
                onClick={() => {
                  setFormStatus('idle');
                  setCompanyName("");
                  setCountryRegion("");
                  setBusinessType("");
                  setContactPersonName("");
                  setEmail("");
                  setPhone("");
                  setBusinessExperience("");
                  setProductCategories("");
                  setMessage("");
                }}
                className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary text-primary transition-all pb-0.5 mt-4 hover:text-black hover:border-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Part 1: Company Information */}
              <div className="space-y-5">
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <Building2 className="h-4.5 w-4.5 text-primary" /> 1. Company Information
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company_name" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company_name"
                      required
                      placeholder="e.g. Global Lighting Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="country_region" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Country / Region *
                    </label>
                    <input
                      type="text"
                      id="country_region"
                      required
                      placeholder="e.g. United States"
                      value={countryRegion}
                      onChange={(e) => setCountryRegion(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="business_type" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Business Type *
                  </label>
                  <select
                    id="business_type"
                    required
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 bg-white outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <option value="">Select business type</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Brand">Brand</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Part 2: Contact Details */}
              <div className="space-y-5">
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <User className="h-4.5 w-4.5 text-primary" /> 2. Contact Details
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact_person_name" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      id="contact_person_name"
                      required
                      placeholder="Full name"
                      value={contactPersonName}
                      onChange={(e) => setContactPersonName(e.target.value)}
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
                      placeholder="work@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

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
              </div>

              {/* Part 3: Business Profile */}
              <div className="space-y-5">
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-black flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <FileText className="h-4.5 w-4.5 text-primary" /> 3. Business Profile
                </h2>

                <div>
                  <label htmlFor="business_experience" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Current Business Experience
                  </label>
                  <textarea
                    id="business_experience"
                    rows={4}
                    placeholder="Briefly describe your current operations, years in business, and market reach..."
                    value={businessExperience}
                    onChange={(e) => setBusinessExperience(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="product_categories" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Product Categories of Interest
                  </label>
                  <textarea
                    id="product_categories"
                    rows={3}
                    placeholder="Which Jinyu product lines are you most interested in distributing?"
                    value={productCategories}
                    onChange={(e) => setProductCategories(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="additional_message" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Additional Information
                  </label>
                  <textarea
                    id="additional_message"
                    rows={4}
                    placeholder="Any other details you'd like to share with our team..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full md:w-auto px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/95 disabled:opacity-50 transition-all duration-200 shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formStatus === 'submitting' ? (
                    'SUBMITTING...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">Submit Application <Send className="h-3.5 w-3.5" /></span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
      
    </div>
  );
}
