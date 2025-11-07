"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  images?: { url: string }[] | null;
  category?: string;
  createdAt: string;
}

const categories = ["All", "TRENDING", "TODAY", "WEEKLY"] as const;

// Ethiopian Calendar & Time Helpers
const getEthiopianDateParts = (date: Date) => {
  try {
    const fmt = new Intl.DateTimeFormat("am-ET-u-ca-ethiopic", {
      timeZone: "Africa/Addis_Ababa",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const parts = fmt.formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const year = parts.find((p) => p.type === "year")?.value ?? "";
    return { day, month, year };
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

// Smart time display
const formatSmartTime = (createdAt: string): { relative: string; ethiopian: string } => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) {
    return { relative: "Just now", ethiopian: formatEthiopianDateTime(created) };
  }
  if (diffInMinutes < 60) {
    return { relative: `${diffInMinutes} min ago`, ethiopian: formatEthiopianDateTime(created) };
  }
  if (diffInHours < 24) {
    return { relative: `${diffInHours} hr ago`, ethiopian: formatEthiopianDateTime(created) };
  }

  return {
    relative: "",
    ethiopian: formatEthiopianDateTime(created),
  };
};

const formatEthiopianDateTime = (date: Date): string => {
  const { day, month, year } = getEthiopianDateParts(date);
  const { hh, min } = getEatHMS(date);
  return `${hh}:${min} | ${month} ${day}, ${year}`;
};

// Category badge color
const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "TRENDING":
      return "bg-red-600";
    case "TODAY":
      return "bg-blue-600";
    case "WEEKLY":
      return "bg-yellow-600";
    case "GENERAL":
      return "bg-gray-600";
    default:
      return "bg-[#00C764]";
  }
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"All" | typeof categories[number]>("All");
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchNews = useCallback(
    async (pageNum: number, category: typeof selectedCategory = "All") => {
      setLoading(true);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/news?page=${pageNum}&limit=6`;
        if (category && category !== "All") {
          url += `&category=${encodeURIComponent(category)}`;
        }

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch news");

        const result = await res.json();
        const data: NewsItem[] = Array.isArray(result.data) ? result.data : [];

        setNews((prev) => (pageNum === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === 6);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setNews, setHasMore]
  );

  // Fetch when category changes
  useEffect(() => {
    setPage(1);
    fetchNews(1, selectedCategory);
  }, [selectedCategory, fetchNews]);

  // Infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, selectedCategory);
    }
  }, [page, selectedCategory, fetchNews]);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // --- ImageCarousel Component ---
  const ImageCarousel = ({ images }: { images: { url: string }[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const isMultiple = images.length > 1;

    // Touch handling
    const touchStartRef = useRef<number | null>(null);
    const touchEndRef = useRef<number | null>(null);

    // Auto-advance every 5 seconds
    useEffect(() => {
      if (!isMultiple || isPaused) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }, [isMultiple, isPaused, images.length]);

    const goToPrev = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      touchEndRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const diff = touchStartRef.current - touchEndRef.current;

      if (diff > 50) {
        goToNext();
      } else if (diff < -50) {
        goToPrev();
      }

      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    if (images.length === 0) return null;

    return (
      <div
        ref={carouselRef}
        className="relative w-full h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Slider */}
        <div className="w-full h-full overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 relative h-60">
                <Image
                  src={img.url}
                  alt={`Image ${idx + 1} of ${images.length}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Left Arrow */}
        {isMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
            aria-label="Previous image"
          >
            ❮
          </button>
        )}

        {/* Right Arrow */}
        {isMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
            aria-label="Next image"
          >
            ❯
          </button>
        )}

        {/* Dots Indicator */}
        {isMultiple && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Count Badge */}
        {isMultiple && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-mono px-2 py-1 rounded-full z-10">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#00150C] text-gray-200 relative">
      {/* Back to Home Button */}
      <Link href="/">
        <button className="fixed top-4 left-4 z-40 bg-[#00C764] hover:bg-[#00D96F] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm flex items-center gap-2 backdrop-blur-sm">
          ← Home
        </button>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-serif">
            All News & Updates
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay informed with official announcements from Koore Zone Administration office
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 capitalize
                ${selectedCategory === cat
                  ? "bg-[#00C764] text-white shadow-lg hover:bg-[#00D96F]"
                  : "bg-[#002214] text-gray-300 hover:bg-[#003322] border border-[#003322]"
                }
              `}
            >
              {cat}
            </Badge>
          ))}
        </motion.div>

        {/* News Grid */}
        {news.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-semibold text-gray-400">No News Found</h3>
            <p className="mt-3 text-gray-500 text-lg">Check back later for updates.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {news.map((item, index) => {
              const isExpanded = expandedPosts.includes(item.id);
              const timeDisplay = formatSmartTime(item.createdAt);

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-[#001A0F] rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-[#00C764]/30 overflow-hidden border border-[#002214] transition-all duration-300 group flex flex-col"
                >
                  {/* Image Carousel */}
                  {item.images && item.images.length > 0 ? (
                    <div className="relative h-60 group overflow-hidden rounded-t-3xl">
                      <ImageCarousel images={item.images} />
                    </div>
                  ) : (
                    <div className="h-60 bg-gradient-to-br from-[#001A0F] to-[#002214] flex items-center justify-center rounded-t-3xl">
                      <span className="text-gray-500 text-sm font-medium">No Image Available</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-white font-serif leading-tight line-clamp-2 group-hover:text-[#00C764] transition-colors">
                      {item.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-3 mb-4">
                      {item.category && (
                        <Badge
                          className={`${getCategoryColor(
                            item.category
                          )} text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-medium`}
                        >
                          {item.category.toLowerCase()}
                        </Badge>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-mono">
                          {timeDisplay.relative || timeDisplay.ethiopian}
                        </span>
                        {timeDisplay.relative && (
                          <span className="text-xs text-gray-500 font-mono">
                            {timeDisplay.ethiopian}
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-gray-300 leading-relaxed flex-1 ${
                        !isExpanded ? "line-clamp-4" : ""
                      }`}
                    >
                      {item.content}
                    </p>

                    {item.content.length > 200 && (
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="mt-5 text-[#00C764] hover:text-[#00D96F] font-medium text-sm transition-colors self-start"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C764] border-t-transparent"></div>
            <p className="ml-3 text-gray-400">Loading more news...</p>
          </motion.div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-16"></div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#00C764] to-[#00D96F] text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-105 active:scale-95"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}