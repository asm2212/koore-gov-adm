"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Mountain, Menu, Mail, FileText } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Tourism", href: "/admin/tourism", icon: Mountain },
  { name: "Docs", href: "/admin/docs", icon: FileText }, // Docs
  { name: "Messages", href: "/admin/messages", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-accent text-background rounded-md shadow-lg"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "w-64"}
        `}
      >
        {/* Logo / Header */}
        <div
          className={`p-6 border-b border-border flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <h2
            className={`text-xl font-bold ${isCollapsed ? "sr-only" : "text-accent"}`}
            aria-label="Admin Panel"
          >
            Admin Panel
          </h2>
          {isCollapsed && (
            <div className="w-8 h-8 bg-accent rounded text-background flex items-center justify-center font-bold text-sm">
              A
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Active if pathname starts with href (handles subpages)
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isCollapsed ? "justify-center" : "justify-start"}
                      ${isActive
                        ? "bg-accent text-background font-medium shadow-sm"
                        : "hover:bg-muted text-foreground hover:text-foreground"
                      }
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Button (Desktop Only) */}
        <div className="p-4 border-t border-border hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu
              className={`h-5 w-5 transform transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Backdrop Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
