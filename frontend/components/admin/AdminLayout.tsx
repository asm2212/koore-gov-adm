import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar is fixed-position and handles its own visibility */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:pl-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}