
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  category: "Community" | "Government" | "Cultural" | "Health" | "Education";
  imageUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const categories = ["All", "Community", "Government", "Cultural", "Health", "Education"] as const;

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?page=1&limit=10`);
        if (!res.ok) throw new Error("Failed to fetch events");

        const data: Event[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        // Mock fallback data
        const mockData: Event[] = [
          {
            id: 1,
            title: "Annual Koore Cultural Festival",
            description: "Celebrate the rich heritage of the Koore people with traditional music, dance, food, and crafts.",
            location: "Zonal Administration Office",
            startDate: "2025-04-12T10:00:00",
            endDate: "2025-04-12T22:00:00",
            category: "Cultural",
            imageUrl: "/koore-hero-dark.png",
          },
          {
            id: 2,
            title: "District Health Awareness Day",
            description: "Free medical checkups, vaccinations, and health education for all residents.",
            location: "Koore General Hospital",
            startDate: "2025-04-15T08:00:00",
            category: "Health",
            imageUrl: "/koore-hero-dark.png",
          },
          {
            id: 3,
            title: "Monthly Community Town Hall",
            description: "Open forum for citizens to discuss local issues with zone administrators.",
            location: "Zonal Administration Office",
            startDate: "2025-04-20T14:00:00",
            category: "Government",
          },
        ];
        setEvents(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // ✅ Empty dep: runs once on mount

  // ✅ Filter events — now includes `events` in dependencies
  useEffect(() => {
    let result = [...events]; // Use latest `events`

    if (searchQuery) {
      result = result.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    setFilteredEvents(result);
  }, [events, searchQuery, selectedCategory]); // ✅ Fixed: `events` added

  // Back to top
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Fixed: Required param `startDate` comes first
  const hasEnded = (startDate: string, endDate?: string): boolean => {
    const now = new Date();
    const end = endDate ? new Date(endDate) : new Date(startDate);
    return now > end;
  };

  const formatSimpleDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-serif mb-4">
            Public Event Calendar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with upcoming community gatherings, government meetings, health drives, and cultural celebrations.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 mb-12"
        >
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors capitalize
                  ${
                    selectedCategory === cat
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-500">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold text-gray-700">No Events Found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter.</p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {filteredEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  {/* Image */}
                  {event.imageUrl ? (
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 md:p-8 md:w-2/3">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                          ${
                            event.category === "Government"
                              ? "bg-blue-100 text-blue-800"
                              : event.category === "Cultural"
                              ? "bg-purple-100 text-purple-800"
                              : event.category === "Health"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        `}
                      >
                        {event.category}
                      </Badge>
                      {hasEnded(event.startDate, event.endDate) && (
                        <Badge className="bg-gray-100 text-gray-600">Past Event</Badge>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>

                    <div className="space-y-2 text-gray-600 text-sm">
                      <p className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.endDate
                          ? `${formatSimpleDate(event.startDate)} – ${formatSimpleDate(event.endDate)}`
                          : formatSimpleDate(event.startDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(event.startDate)}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </p>
                    </div>

                    <p className="mt-4 text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-105"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}