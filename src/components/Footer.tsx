"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-background text-foreground border-t">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">
                JINYU
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Your trusted manufacturer of premium lighting equipment and appliances, delivering engineering excellence and quality since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Quick links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-foreground" />
                <span>sales@jinyucapital.com</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-foreground" />
                <span>+86-139-2243-0321</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-foreground" />
                <span className="leading-relaxed">Unit 119, Building 19, Changfeng International, No. 96 Lixin 12th Road, Xintang Town, Zengcheng District, Guangzhou City</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Follow us</h3>
            <div className="flex space-x-5">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin size={22} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="Twitter">
                <Twitter size={22} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61590193816131" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="Facebook">
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2026 Jinyu. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
