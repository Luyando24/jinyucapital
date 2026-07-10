"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import Logo from '@/components/Logo';
import { useStoreSettings } from '@/components/StoreSettingsContext';

const DEFAULTS = {
  email: 'sales@jinyucapital.com',
  phone: '+86-139-2243-0321',
  address: 'Unit 119, Building 19, Changfeng International, No. 96 Lixin 12th Road, Xintang Town, Zengcheng District, Guangzhou City',
  facebook: 'https://www.facebook.com/profile.php?id=61590193816131',
  store_name: 'Jinyu',
};

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useStoreSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const email = settings?.email || DEFAULTS.email;
  const phone = settings?.phone || DEFAULTS.phone;
  const address = settings?.address || DEFAULTS.address;
  const facebook = settings?.facebook || DEFAULTS.facebook;
  const tiktok = settings?.tiktok;
  const instagram = settings?.instagram;
  const storeName = settings?.store_name || DEFAULTS.store_name;

  return (
    <footer className="bg-background text-foreground border-t">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight">
                {storeName.toUpperCase()}
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
                <span>{email}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-foreground" />
                <span>{phone}</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-foreground" />
                <span className="leading-relaxed">{address}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Follow us</h3>
            <div className="flex space-x-5">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="Facebook">
                  <Facebook size={22} />
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="TikTok">
                  {/* TikTok icon via SVG since lucide doesn't have it */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.23 8.23 0 004.82 1.54V6.83a4.85 4.85 0 01-1.05-.14z"/>
                  </svg>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
              )}
              {/* Fallback LinkedIn if no social links set */}
              {!facebook && !tiktok && !instagram && (
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200" aria-label="LinkedIn">
                  <Linkedin size={22} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <a
            href="https://www.spaceminds.agency/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Website design by SpaceMinds
          </a>
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
