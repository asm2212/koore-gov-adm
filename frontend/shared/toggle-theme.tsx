// "use client";

// import { useTheme } from "next-themes";
// import { Moon, Sun } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";

// export const ToggleTheme = () => {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   // Prevent hydration mismatch
//   useEffect(() => setMounted(true), []);

//   if (!mounted) {
//     return (
//       <Button variant="ghost" size="sm" className="w-full justify-start cursor-default">
//         <span className="flex items-center gap-2">
//           <Sun className="h-5 w-5 animate-pulse opacity-70" />
//           <span className="hidden lg:inline-block h-4 w-16 rounded bg-muted animate-pulse"></span>
//         </span>
//       </Button>
//     );
//   }

//   const isDark = theme === "dark";

//   return (
//     <Button
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       size="sm"
//       variant="ghost"
//       aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
//       className="w-full justify-start gap-2"
//     >
//       {isDark ? (
//         <>
//           <Sun className="h-5 w-5" />
//           <span className="hidden lg:inline-block">Light</span>
//           <span className="lg:hidden">☀️</span>
//         </>
//       ) : (
//         <>
//           <Moon className="h-5 w-5" />
//           <span className="hidden lg:inline-block">Dark</span>
//           <span className="lg:hidden">🌙</span>
//         </>
//       )}
//     </Button>
//   );
// };