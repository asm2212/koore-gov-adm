"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { formatSmartTime } from "@/lib/ethiopian-date"; // ✅ Ethiopian calendar

interface NewsItem {
  id: number;
  title: string;
  content: string;
  images?: { url: string }[] | null;
  createdAt: string;
  category: "TRENDING" | "TODAY" | "WEEKLY" | "GENERAL";
}

export const HomeSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualPause, setIsManualPause] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/news?limit=10`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");

      const result = await res.json();
      const data = Array.isArray(result.data) ? result.data : [];
      setNews(data);
      if (data.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Back to top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-advance carousel
  useEffect(() => {
    if (loading || news.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, news.length, isPaused]);

  // Scroll to current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && news.length > 0) {
      const cardWidth = container.clientWidth;
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, news.length]);

// Manual navigation (memoized)
const goToPrev = useCallback(() => {
  if (news.length === 0) return;
  setIsManualPause(true);
  setIsPaused(true);
  setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
}, [news.length]);

const goToNext = useCallback(() => {
  if (news.length === 0) return;
  setIsManualPause(true);
  setIsPaused(true);
  setCurrentIndex((prev) => (prev + 1) % news.length);
}, [news.length]);

// Touch swipe (memoized + uses goToNext/goToPrev)
const handleTouchStart = useCallback((e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
}, []);

const handleTouchMove = useCallback(
  (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      setIsManualPause(true);
      setIsPaused(true);
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      touchStartX.current = 0;
    }
  },
  [goToNext, goToPrev]
);

// Auto-advance carousel (uses goToNext)
useEffect(() => {
  if (loading || news.length === 0 || isPaused) return;

  const interval = setInterval(() => {
    goToNext();
  }, 2000);

  return () => clearInterval(interval);
}, [loading, news.length, isPaused, goToNext]);

// Keyboard navigation
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrev();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [goToPrev, goToNext]);


  // Category badge
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "TRENDING":
        return "bg-red-600";
      case "TODAY":
        return "bg-blue-600";
      case "WEEKLY":
        return "bg-yellow-600";
      default:
        return "bg-[#00C764]";
    }
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{ height: "100dvh" }}
      aria-labelledby="home-carousel"
    >
      {/* Full-Screen Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory scrollbar-hide"
        onMouseEnter={() => !isManualPause && setIsPaused(true)}
        onMouseLeave={() => !isManualPause && setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        role="region"
        aria-label="Latest news carousel"
        tabIndex={0}
      >
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center"
                aria-label="Loading news item"
              >
                <div className="w-16 h-16 border-4 border-[#00C764] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ))}
          </>
        ) : news.length === 0 ? (
          <div className="flex-shrink-0 w-full h-full flex items-center justify-center text-gray-500">
            <p className="text-xl">No news available</p>
          </div>
        ) : (
          news.map((item, index) => (
            <motion.article
              key={item.id}
              className="flex-shrink-0 w-full h-full relative snap-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="group"
              aria-label={`News item ${index + 1} of ${news.length}: ${item.title}`}
              aria-roledescription="slide"
            >
              {/* Background Image */}
              {item.images && item.images.length > 0 ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={item.images[0].url}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/news-placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-[#00331A] to-[#002214] flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No Image Available</span>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10 max-w-4xl">
                {/* Category Badge */}
                <span
                  className={`inline-block text-xs px-3 py-1 ${getCategoryColor(
                    item.category
                  )} text-white rounded-full font-medium mb-3 capitalize`}
                >
                  {item.category}
                </span>

                {/* Title */}
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                  {item.title}
                </h3>

                {/* Content */}
                <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-5 line-clamp-3">
                  {item.content}
                </p>

                {/* Ethiopian Date & Time */}
                <div className="text-gray-300 text-sm space-y-1">
                  {(() => {
                    const timeDisplay = formatSmartTime(item.createdAt);
                    return (
                      <>
                        {timeDisplay.relative && (
                          <div className="font-mono">{timeDisplay.relative}</div>
                        )}
                        <div className="font-mono">{timeDisplay.ethiopian}</div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      {/* Navigation & Controls */}
      <AnimatePresence>
        {!loading && news.length > 0 && (
          <>
            {/* Left Arrow */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center z-20 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
              aria-label="Previous news item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* Right Arrow */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center z-20 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
              aria-label="Next news item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* Dots Indicator */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {news.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsManualPause(true);
                    setIsPaused(true);
                    setCurrentIndex(idx);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-[#00C764] scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentIndex ? "true" : undefined}
                />
              ))}
            </div>

            {/* Pause/Play Toggle */}
            <button
              onClick={() => {
                setIsManualPause(true);
                setIsPaused((prev) => !prev);
              }}
              className="absolute top-4 right-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center z-20 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
              title={isPaused ? "Resume auto-play" : "Pause auto-play"}
            >
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Slide Counter */}
            <div className="absolute top-4 left-20 text-white text-sm font-mono bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {news.length}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleBackToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#00C764] to-[#00D96F] text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-105"
            aria-label="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};