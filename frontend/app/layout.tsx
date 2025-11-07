import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/shared/navbar";
import { ThemeProvider } from "@/shared/theme-provider";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/app/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Koore Government Administration Office",
    template: "%s | Koore GOV",
  },
  description:
    "Official portal for public services and information in Koore Zone",
  metadataBase: new URL("https://koorezoneadm.gov.et"),
  openGraph: {
    title: "Koore Zone Administration Office",
    description:
      "Official portal for public services and information in Koore Zone",
    url: "https://koore.gov.et",
    siteName: "Koore GOV",
    locale: "en_ET",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Koore Zone Administration Office",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KooreGovernment",
    creator: "@KooreGovernment",
    title: "Koore Zone Administration Office",
    description:
      "Official portal for public services and information in Koore Zone",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://koore.gov.et",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#00150C] font-sans antialiased text-white",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* ✅ Wrap everything in LanguageProvider */}
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="py-6 border-t border-[#002214] text-center text-sm text-gray-400 bg-[#00150C]">
                <p>
                  &copy; {new Date().getFullYear()} Koore Zone. All rights
                  reserved.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Developed with ❤️ by{" "}
                  <a
                    href="https://www.linkedin.com/in/asm2212"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00C764] hover:underline transition-colors"
                  >
                    Asmare Admasu
                  </a>
                </div>
              </footer>
            </div>
            <Toaster
              richColors
              position="top-right"
              expand={false}
              theme="dark"
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
