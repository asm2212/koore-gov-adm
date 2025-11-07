"use client";

import StatCard from "@/components/admin/stats/StatCard";
import { useState, useEffect } from "react";

// Use environment variable for API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function TotalStats() {
  // Initialize stats state
  const [stats, setStats] = useState({
    news: 0,
    tourism: 0,
    totalImages: 0,
  });

  // Key to trigger animation reset on all StatCards
  const [refreshKey, setRefreshKey] = useState(0);

  // Load stats on mount and whenever dependencies change
  useEffect(() => {
    const loadStats = async () => {
      // Get auth token from localStorage
      const token = localStorage.getItem("portal_token");
      if (!token) {
        console.warn("Authentication token not found. User may not be logged in.");
        return;
      }

      try {
        // Fetch news and tourism data in parallel
        const [newsRes, tourismRes] = await Promise.all([
          fetch(`${API_BASE}/news`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            // Optional: Add cache control
            cache: "no-store",
          }),
          fetch(`${API_BASE}/tourism`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }),
        ]);

        // Handle non-2xx responses
        if (!newsRes.ok) {
          const errorText = await newsRes.text();
          throw new Error(`News fetch failed [${newsRes.status}]: ${errorText}`);
        }
        if (!tourismRes.ok) {
          const errorText = await tourismRes.text();
          throw new Error(`Tourism fetch failed [${tourismRes.status}]: ${errorText}`);
        }

        // Parse JSON responses
        const newsData = await newsRes.json();
        const tourismData = await tourismRes.json();

        // Debug: Log full responses (remove in production if needed)
        console.log("Fetched News Data:", newsData);
        console.log("Fetched Tourism Data:", tourismData);

        // Extract arrays safely
        const newsList = Array.isArray(newsData.data) ? newsData.data : [];
        const tourismList = Array.isArray(tourismData.data) ? tourismData.data : [];

        // Count total images
        const totalImages = [...newsList, ...tourismList].reduce(
          (sum: number, item: any) => sum + (Array.isArray(item.images) ? item.images.length : 0),
          0
        );

        // Update stats
        setStats({
          news: newsList.length,
          tourism: tourismList.length,
          totalImages,
        });

        // Trigger animation reset
        setRefreshKey((prev) => prev + 1);
      } catch (err: any) {
        console.error("Failed to load dashboard statistics:", err);
        // Optionally: use toast.error("Failed to load stats") if Toaster is available here
      }
    };

    loadStats();
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="News Articles"
        value={stats.news}
        color="blue"
        icon="📰"
        refreshKey={refreshKey}
        tooltip="Total number of published news articles in the system"
        link="/admin/news"
      />
      <StatCard
        title="Tourism Spots"
        value={stats.tourism}
        color="green"
        icon="🏔️"
        refreshKey={refreshKey}
        tooltip="Active tourism destinations available on the public site"
        link="/admin/tourism"
      />
      <StatCard
        title="Total Images"
        value={stats.totalImages}
        color="purple"
        icon="🖼️"
        refreshKey={refreshKey}
        tooltip="Total number of uploaded images across all news and tourism content"
        link="/admin/media" // Optional: create a media library page later
      />
    </div>
  );
}