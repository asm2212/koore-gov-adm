"use client";

import React, { useEffect, useState } from "react";
import { Mail, ChevronsDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

// --- Social Links ---
const socialLinks = [
  {
    href: "https://www.facebook.com/kzc.koore?mibextid=ZbWKwL",
    label: "Follow us on Facebook",
    icon: <FaFacebook size={18} />,
  },
  {
    href: "https://t.me/koorezonegovtcom",
    label: "Join us on Telegram",
    icon: <FaTelegram size={18} />,
  },
  {
    href: "https://x.com/koorezone2024?t=-FWE6ovcewemu0FJTq-tww&s=09",
    label: "Follow us on X (Twitter)",
    icon: <FaTwitter size={18} />,
  },
  {
    href: "https://www.tiktok.com/@koorezonegovecommunicati?_t=ZM-8sWjNJefDFO&_r=1",
    label: "Follow us on TikTok",
    icon: <FaTiktok size={18} />,
  },

];

// --- Translations ---
const translations = {
  en: {
    home: { label: "Home", href: "/" },
    about: { label: "About Us", href: "/about" },
    services: { label: "Services", href: "/services" },
    news: { label: "News", href: "/news" },
    docs: { label: "Docs", href: "/docs" },
    contact: { label: "Contact", href: "/contact" },
  },
  am: {
    home: { label: "መነሻ", href: "/" },
    about: { label: "ስለ እኛ", href: "/about" },
    services: { label: "አገልግሎቶች", href: "/services" },
    news: { label: "ዜና", href: "/news" },
    docs: { label: "ሰነዶች", href: "/docs" },
    contact: { label: "እኛን ያነጋግሩ", href: "/contact" },
  },
};

// --- Ethiopian Calendar Helpers ---
const getEthiopianDateParts = (date: Date) => {
  try {
    const fmt = new Intl.DateTimeFormat("am-ET-u-ca-ethiopic", {
      timeZone: "Africa/Addis_Ababa",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const parts = fmt.formatToParts(date);
    return {
      day: parts.find((p) => p.type === "day")?.value ?? "",
      month: parts.find((p) => p.type === "month")?.value ?? "",
      year: parts.find((p) => p.type === "year")?.value ?? "",
    };
  } catch {
    return { day: "--", month: "Unknown", year: "----" };
  }
};

const getEatHMS = (date: Date) => {
  try {
    const t = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Addis_Ababa",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);

    const h24 = Number(t.find((p) => p.type === "hour")?.value ?? "0");
    const min = t.find((p) => p.type === "minute")?.value ?? "00";
    const sec = t.find((p) => p.type === "second")?.value ?? "00";

    const etHour = ((h24 + 6) % 12) || 12;
    const hh = String(etHour).padStart(2, "0");

    return { hh, min, sec };
  } catch {
    return { hh: "--", min: "--", sec: "--" };
  }
};

// --- Navbar Component ---
export const Navbar = () => {
  const [ethiopianTime, setEthiopianTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  const pathname = usePathname();

  // Live Ethiopian Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const { day, month, year } = getEthiopianDateParts(now);
      const { hh, min, sec } = getEatHMS(now);
      setEthiopianTime(`${hh}:${min}:${sec} | ${month} ${day}, ${year}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#00150C] border-b border-[#002214] shadow-lg">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="hidden md:flex items-center justify-between h-10 text-white text-sm">
          <div className="font-medium text-[#00C764] whitespace-nowrap">
            {ethiopianTime}
          </div>
          <div className="flex items-center gap-6">
            <a
              href="mailto:koorezonecom@gmail.com"
              className="flex items-center gap-1 hover:text-[#00C764]"
            >
              <Mail size={18} />
              <span className="sr-only">Email</span>
            </a>
            <div className="flex gap-3 text-[#00C764]">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2 rounded-full hover:bg-[#00C764]/20 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Row */}
        <div className="flex items-center justify-between h-16 border-t border-[#002214]">
<Link href="/" className="flex items-center font-bold text-white">
  <Image
    src="/logo.jpg"
    alt="Koore Zone Logo"
    width={70}   // bigger size
    height={70}
    className="rounded-full mr-3 border-2 border-[#00C764] object-cover"
  />
  <span className="text-lg sm:text-xl md:text-2xl leading-tight">
    Koore Zone <br className="hidden sm:block" />
    Administration Office
  </span>
</Link>



          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8 text-white font-medium"
            aria-label="Main navigation"
          >
            {Object.entries(translations[lang]).map(([key, { label, href }]) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`relative group ${
                    isActive
                      ? "text-[#00C764] font-semibold"
                      : "text-gray-300 hover:text-[#00C764]"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#00C764] transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            <button
              onClick={toggleLang}
              className="ml-4 px-3 py-1 rounded border border-[#00C764] text-white hover:bg-[#00C764]/20"
            >
              {lang === "en" ? "አማ" : "EN"}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-white hover:text-[#00C764]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#00150C] border-t border-[#002214]"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-3 space-y-1">
                {Object.entries(translations[lang]).map(
                  ([key, { label, href }]) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={key}
                        href={href}
                        className={`block py-3 px-4 rounded-lg ${
                          isActive
                            ? "bg-[#00C764]/20 text-[#00C764] font-bold"
                            : "text-gray-300 hover:bg-[#00C764]/10 hover:text-white"
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  }
                )}
                <button
                  onClick={toggleLang}
                  className="w-full mt-2 px-3 py-2 rounded border border-[#00C764] text-white hover:bg-[#00C764]/20"
                >
                  {lang === "en" ? "አማ" : "EN"}
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
};

