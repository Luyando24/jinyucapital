"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Controlled fields to support pre-population
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("Project Quote Request");

  useEffect(() => {
    if (!searchParams) return;
    const productName = searchParams.get("product");
    const quantity = searchParams.get("quantity") || "10";
    if (productName) {
      setSubject("Project Quote Request");
      setMessage(`Hi, I would like to request a quote for the following product:\nProduct: ${decodeURIComponent(productName)}\nQuantity: ${quantity} units.\n\nPlease provide pricing, estimated lead times, and shipping terms.`);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement)?.value,
      email: (form.elements.namedItem('email') as HTMLInputElement)?.value,
      subject,
      message,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send message.');
      setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  const faqs = [
    {
      q: "How long does shipping and delivery take?",
      a: "Standard industrial orders are dispatched via ocean freight or air cargo depending on volume. Production and delivery lead times vary from 15 to 30 days depending on custom specifications."
    },
    {
      q: "What is your product warranty policy?",
      a: "All Jinyu Capital lighting fixtures, LED street lamps, and power supplies come with a comprehensive 5-year replacement warranty, reflecting our engineering and quality standards."
    },
    {
      q: "Do you support custom OEM/ODM manufacturing?",
      a: "Yes. We offer complete OEM/ODM services including photometrics design, custom aluminum mold creation, and branding for global wholesale projects. Please submit a quote request."
    },
  ];

  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* Hero */}
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
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <MessageCircle className="h-3 w-3" /> Get In Touch
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-4">CONTACT US.</h1>
          <p className="text-lg max-w-xl mx-auto text-neutral-400 font-light leading-relaxed">
            We would love to hear from you. Our team is here to assist with your lighting design and custom specifications.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Info + FAQ */}
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                Reach Out
              </span>
              <h2 className="font-display text-3xl font-extrabold mt-2 mb-4 tracking-tight">
                CONTACT JINYU.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-500 font-light">
                Have questions about our lighting specifications, photometrics, OEM mold development, or custom global shipping solutions? Contact our corporate support team.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Phone className="h-5 w-5" />,
                  title: "Phone Support",
                  value: "+86-139-2243-0321",
                  sub: "Mon–Fri, 9am–6pm HKT",
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  title: "Email Inquiry",
                  value: "sales@jinyucapital.com",
                  sub: "Replied within 1 business day",
                },
                {
                  icon: <MapPin className="h-5 w-5" />,
                  title: "Guangzhou Office",
                  value: "Unit 119, Building 19, Changfeng International,\nNo. 96 Lixin 12th Road, Xintang Town,\nZengcheng District, Guangzhou City, China",
                  sub: "",
                },
                {
                  icon: <Clock className="h-5 w-5" />,
                  title: "Office Hours",
                  value: "Monday – Friday",
                  sub: "9:00 AM – 6:00 PM HKT",
                },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl border border-neutral-200 bg-white"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100 text-black"
                  >
                    {contact.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{contact.title}</h3>
                    <p className="text-sm whitespace-pre-line text-neutral-600 font-light">{contact.value}</p>
                    {contact.sub && <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{contact.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-display text-xl font-extrabold mb-5 uppercase tracking-wide">
                FAQs
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-neutral-200 overflow-hidden bg-white"
                  >
                    <button
                      className="w-full flex justify-between items-center px-5 py-4 text-left font-bold"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span className="text-sm font-semibold text-black">{faq.q}</span>
                      <span
                        className="text-lg font-bold transition-transform duration-200 text-black"
                        style={{
                          transform: openFaq === idx ? "rotate(45deg)" : "rotate(0)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4 border-t border-neutral-100">
                        <p className="text-xs sm:text-sm pt-3 leading-relaxed text-neutral-500 font-light">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="p-8 md:p-10 rounded-xl border border-neutral-200 bg-neutral-50">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
              Submit Form
            </span>
            <h2 className="font-display text-2xl font-extrabold mt-2 mb-8 tracking-tight uppercase">
              SEND A MESSAGE.
            </h2>

            {formStatus === 'success' ? (
              <div className="flex flex-col items-center text-center gap-4 py-12">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-primary text-white"
                >
                  ✓
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider">Message Sent</h3>
                <p className="text-sm text-neutral-500 font-light">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="text-xs font-bold uppercase tracking-widest border-b-2 border-black transition-colors pb-0.5 mt-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "firstName", label: "First Name", type: "text", placeholder: "Alex" },
                    { id: "lastName", label: "Last Name", type: "text", placeholder: "Smith" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        required
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-black"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 bg-white outline-none cursor-pointer focus:border-black"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Project Quote Request">Project Quote Request</option>
                    <option value="Custom OEM/ODM Manufacturing">Custom OEM/ODM Manufacturing</option>
                    <option value="Global Supply Chain Services">Global Supply Chain Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-neutral-500" style={{ fontFamily: "var(--font-display)" }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you out..."
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg border border-neutral-200 bg-white outline-none resize-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formStatus === 'submitting' ? (
                    'SENDING...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">SEND MESSAGE <Send className="h-3.5 w-3.5" /></span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4 min-h-screen bg-white">
        <div className="h-10 w-10 animate-spin border-4 border-black border-t-transparent rounded-full" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading contact page...</p>
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
