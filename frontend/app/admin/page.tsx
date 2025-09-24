"use client";

import { useContentData } from "@/hooks/useContentData";
import AdminLayout from "@/components/admin/AdminLayout";
import TotalStats from "@/components/admin/stats/TotalStats";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns"; // nice relative time display
import { Pencil } from "lucide-react";

export default function DashboardPage() {
  const { data: newsData } = useContentData("news");
  const { data: tourismData } = useContentData("tourism");

  // Slice the last 5 items (assuming backend already returns ordered data)
  const latestNews = (newsData || []).slice(0, 5);
  const latestTourism = (tourismData || []).slice(0, 5);

  return (
    <AdminLayout>
      {/* Notifications */}
      <Toaster richColors position="top-right" />

      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Section */}
      <TotalStats />

      {/* Welcome Section */}
      <div className="mt-12 bg-muted p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Welcome, Admin 🎉</h2>
        <p className="text-muted-foreground mb-4">
          Use the sidebar to manage all content. Here are some quick actions to get you started:
        </p>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/news">+ Add News</Link>
          </Button>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/admin/tourism">+ Add Tourism Spot</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/news">Manage News</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/tourism">Manage Tourism</Link>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest News */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">📰 Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            {latestNews.length === 0 ? (
              <p className="text-muted-foreground italic">No recent news articles.</p>
            ) : (
              <ul className="space-y-3">
                {latestNews.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b border-border pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Link
                      href={`/admin/news`}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Latest Tourism */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">🌍 Latest Tourism Spots</CardTitle>
          </CardHeader>
          <CardContent>
            {latestTourism.length === 0 ? (
              <p className="text-muted-foreground italic">No recent tourism spots.</p>
            ) : (
              <ul className="space-y-3">
                {latestTourism.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b border-border pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <Link
                      href={`/admin/tourism`}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
