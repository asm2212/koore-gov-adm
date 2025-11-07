"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatSmartTime } from "@/lib/ethiopian-date"; // ✅ Import shared helper

interface NewsItem {
  id: number;
  title: string;
  content: string;
  images?: { url: string }[] | null;
  category?: string;
  createdAt: string;
}

interface NewsSectionProps {
  limit?: number;
  defaultCategory?: string;
  heading?: string;
  description?: string;
}

const categories = ["All", "TRENDING", "TODAY", "WEEKLY"] as const;

// Category badge color
const getCategoryColor = (cat: string) => {
  switch (cat) {
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

export const NewsSection = ({
  limit = 10,
  defaultCategory = "All",
  heading = "Latest from Koore Zone",
  description = "Updates on community, services, and development.",
}: NewsSectionProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchNews = useCallback(async (category = "All") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/news?limit=${limit}`;
      if (category && category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");

      const result = await res.json();
      const data: NewsItem[] = Array.isArray(result.data) ? result.data : [];
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    // Auto-advance every 2 seconds
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
              <div key={idx} className="w-full flex-shrink-0 relative h-60 lg:h-72">
                <Image
                  src={img.url}
                  alt={`Image ${idx + 1} of ${images.length}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 700px"
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
    <section className="py-16 sm:py-24" aria-labelledby="news-section-heading">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="news-section-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">
            {heading}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">{description}</p>
        </motion.div>
      </div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto px-4 mb-12"
      >
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant="secondary"
            onClick={() => setSelectedCategory(cat)}
            className={`cursor-pointer px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 capitalize
              ${
                selectedCategory === cat
                  ? "bg-[#00C764] text-white shadow-lg hover:bg-[#00D96F]"
                  : "bg-[#002214] text-gray-300 hover:bg-[#003322] border border-[#003322]"
              }
            `}
          >
            {cat}
          </Badge>
        ))}
      </motion.div>

      {/* Expanded Grid: Wider Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00C764] border-t-transparent"></div>
          </div>
        ) : news.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-semibold text-gray-400">No News Found</h3>
            <p className="mt-3 text-gray-500 text-lg">Check back later for updates.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-12">
              {news.map((item, index) => {
                const isExpanded = expandedPosts.includes(item.id);
                const timeDisplay = formatSmartTime(item.createdAt);

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="bg-[#001A0F] rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-[#00C764]/30 overflow-hidden border border-[#002214] transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    {/* Image Carousel */}
                    {item.images && item.images.length > 0 ? (
                      <div className="relative h-60 lg:h-72 group overflow-hidden rounded-t-3xl">
                        <ImageCarousel images={item.images} />
                      </div>
                    ) : (
                      <div className="h-60 lg:h-72 bg-gradient-to-br from-[#001A0F] to-[#002214] flex items-center justify-center">
                        <span className="text-gray-500 text-base font-medium">No Image Available</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      <h3 className="text-2xl font-bold text-white font-serif leading-tight mb-1 line-clamp-2 group-hover:text-[#00C764] transition-colors duration-200">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-3 mb-5">
                        {item.category && (
                          <Badge
                            className={`${getCategoryColor(
                              item.category
                            )} text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium`}
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
                        className={`text-gray-300 leading-relaxed mb-5 ${
                          !isExpanded ? "line-clamp-4" : ""
                        }`}
                      >
                        {item.content}
                      </p>

                      {item.content.length > 200 && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-[#00C764] hover:text-[#00D96F] font-medium text-sm transition-colors duration-200 flex items-center gap-1 group/read-more"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1 opacity-0 group-hover/read-more:opacity-100 transition-opacity"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* View All News Button */}
            <div className="text-center mt-16">
              <Link href="/news">
                <Badge
                  className="bg-[#00C764] hover:bg-[#00D96F] text-white px-10 py-4 text-lg font-medium cursor-pointer transition-all duration-200 shadow-xl hover:shadow-2xl scale-100 hover:scale-105 inline-flex items-center gap-2"
                >
                  View All News
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Badge>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-[#00C764] to-[#00D96F] text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-105 active:scale-95"
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