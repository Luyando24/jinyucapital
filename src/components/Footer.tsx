"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: "#1c1e21", color: "#FFFFFF" }} className="border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.jpeg"
                alt="Jinyu Logo"
                className="h-7 w-auto object-contain rounded-md"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-sans text-lg font-bold tracking-widest text-white">
                JINYU
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 font-light pr-4">
              Your trusted manufacturer of premium lighting equipment and appliances, delivering engineering excellence and quality since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Quick links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About us" },
                { href: "/products", label: "Products" },
                { href: "/distributor", label: "Become a Distributor" },
                { href: "https://jinyucapital.com/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-neutral-400">
                <Mail className="h-4.5 w-4.5 flex-shrink-0" />
                <a href="mailto:sales@jinyucapital.com" className="text-sm hover:text-white transition-colors">
                  sales@jinyucapital.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-neutral-400">
                <Phone className="h-4.5 w-4.5 flex-shrink-0" />
                <span className="text-sm">
                  +86-139-2243-0321
                </span>
              </li>
              <li className="flex items-start space-x-3 text-neutral-400">
                <MapPin className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  Unit 119, Building 19, Changfeng International, No. 96 Lixin 12th Road, Xintang Town, Zengcheng District, Guangzhou City
                </span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Follow us
            </h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 text-neutral-400 transition-all duration-200 hover:bg-neutral-700 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 text-neutral-400 transition-all duration-200 hover:bg-neutral-700 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 text-neutral-400 transition-all duration-200 hover:bg-neutral-700 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-800"
        >
          <p className="text-sm text-neutral-500 font-light">
            © 2026 Jinyu. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500 font-light">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
