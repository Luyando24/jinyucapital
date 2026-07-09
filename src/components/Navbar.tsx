"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User as UserIcon, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const categories = [
    { label: "Street Lamps", href: "/products?category=Street%20Lamps" },
    { label: "Ceiling Lights", href: "/products?category=Ceiling%20Lights" },
    { label: "Wall Sconces", href: "/products?category=Wall%20Sconces" },
    { label: "Pendant Lamps", href: "/products?category=Pendant%20Lamps" },
    { label: "Industrial Lighting", href: "/products?category=Industrial%20Lighting" },
  ];

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/distributor", label: "Distributor" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300 border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: scrolled ? "#E5E5E7" : "#F5F5F7",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18" style={{ height: "72px" }}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="font-serif text-lg sm:text-xl font-extrabold tracking-widest text-black">
                JINYU CAPITAL
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link */}
            <Link
              href="/"
              className="relative px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-200 group"
              style={{
                color: isActive("/") ? "#000000" : "#707070",
                fontFamily: "var(--font-display)",
              }}
            >
              Home
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-200"
                style={{
                  backgroundColor: "#000000",
                  width: isActive("/") ? "60%" : "0%",
                }}
              />
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="relative px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-200 flex items-center gap-1 hover:text-black focus:outline-none"
                style={{
                  color: isDropdownOpen ? "#000000" : "#707070",
                  fontFamily: "var(--font-display)",
                }}
              >
                Categories
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 mt-1 w-56 rounded-xl border border-neutral-100 bg-white shadow-xl py-2 transition-all duration-250 ${
                  isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="block px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Nav Links */}
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-200 group"
                style={{
                  color: isActive(link.href) ? "#000000" : "#707070",
                  fontFamily: "var(--font-display)",
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    width: isActive(link.href) ? "60%" : "0%",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">




            <Link
              href="/request-quote"
              className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full border border-primary transition-all duration-200 bg-primary text-white hover:bg-white hover:text-primary ml-1 shadow-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="md:hidden flex items-center space-x-3">




            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:bg-neutral-100"
              style={{ color: "#000000" }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 border-t"
        style={{
          maxHeight: isOpen ? "550px" : "0",
          borderColor: "#E5E5E7",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {/* Home Link */}
          <Link
            href="/"
            className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              color: isActive("/") ? "#000000" : "#707070",
              backgroundColor: isActive("/")
                ? "rgba(0,0,0,0.03)"
                : "transparent",
              fontFamily: "var(--font-display)",
            }}
            onClick={() => setIsOpen(false)}
          >
            Home
            {isActive("/") && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
            )}
          </Link>

          {/* Categories Collapsible */}
          <div>
            <button
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none"
              style={{
                color: "#707070",
                fontFamily: "var(--font-display)",
              }}
            >
              Categories
              <ChevronDown 
                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                  isMobileCategoriesOpen ? "rotate-180" : ""
                }`} 
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300 pl-4 bg-neutral-50/50 rounded-lg"
              style={{
                maxHeight: isMobileCategoriesOpen ? "250px" : "0",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  style={{
                    color: pathname === cat.href ? "#000000" : "#707070",
                    fontFamily: "var(--font-display)",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    setIsMobileCategoriesOpen(false);
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Other Links */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                color: isActive(link.href) ? "#000000" : "#707070",
                backgroundColor: isActive(link.href)
                  ? "rgba(0,0,0,0.03)"
                  : "transparent",
                fontFamily: "var(--font-display)",
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t px-2" style={{ borderColor: "#E5E5E7" }}>
            <Link
              href="/request-quote"
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider bg-primary text-white rounded-lg transition-all text-center"
              style={{ fontFamily: "var(--font-display)" }}
              onClick={() => setIsOpen(false)}
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
