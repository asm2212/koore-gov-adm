"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShieldCheck,
  Users,
  UserPlus,
  Newspaper,
  Globe2,
  ActivitySquare,
  ArrowRight,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getToken, getRole } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Stats = {
  totalAdmins: number;
  totalWriters: number;
  totalNews: number;
  totalTourism: number;
};

type ActivityItem = {
  id: string | number;
  message: string;
  createdAt: string;
};

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalAdmins: 0,
    totalWriters: 0,
    totalNews: 0,
    totalTourism: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [systemUptime, setSystemUptime] = useState<string | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/portal-login");
      return;
    }
    const role = getRole(token);
    if (role !== "SUPER_ADMIN") {
      router.replace("/unauthorized");
      return;
    }

    const fetchDashboard = async () => {
      try {
        setError("");
        const [admins, writers, news, tourism, recent] = await Promise.allSettled([
          axios.get(`${API_URL}/admins/count`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/users/count?role=WRITER`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/news/count`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/tourism/count`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/audit?limit=6`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const safeNumber = (res: PromiseSettledResult<any>, fallback = 0) =>
          res.status === "fulfilled" && typeof res.value?.data?.count === "number"
            ? res.value.data.count
            : fallback;

        const recentActivities =
          recent && recent.status === "fulfilled" && Array.isArray(recent.value?.data)
            ? recent.value.data
            : [];

        setStats({
          totalAdmins: safeNumber(admins),
          totalWriters: safeNumber(writers),
          totalNews: safeNumber(news),
          totalTourism: safeNumber(tourism),
        });

        setActivity(
          recentActivities.map((r: any, idx: number) => ({
            id: r.id ?? idx,
            message: r.message ?? "Activity",
            createdAt: r.createdAt ?? new Date().toISOString(),
          }))
        );
      } catch (e: any) {
        setError(e?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUptime = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_URL}/health`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setSystemUptime(res.data?.uptime ?? undefined);
      } catch {
        setSystemUptime(undefined);
      }
    };

    fetchDashboard();
    fetchUptime();
    const uptimeInterval = setInterval(fetchUptime, 5000);

    return () => clearInterval(uptimeInterval);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#3A5B22]" />
            <Badge variant="outline" className="border-[#3A5B22]/30 text-[#3A5B22] bg-[#3A5B22]/5">
              Super Admin
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">Control Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage admins, oversee content, and monitor system status.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/super-admin/manage-admins/create">
            <Button className="bg-[#3A5B22] hover:bg-[#2e4819]">Create Admin</Button>
          </Link>
          <Link href="/super-admin/manage-admins">
            <Button variant="outline" className="border-gray-300">
              Manage Admins
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={<Users className="h-5 w-5" />} label="Admins" value={stats.totalAdmins} hint="Active admin accounts" />
            <StatCard icon={<UserPlus className="h-5 w-5" />} label="Writers" value={stats.totalWriters} hint="Active content writers" />
            <StatCard icon={<Newspaper className="h-5 w-5" />} label="News Posts" value={stats.totalNews} hint="Total published news" />
            <StatCard icon={<Globe2 className="h-5 w-5" />} label="Tourism Places" value={stats.totalTourism} hint="Published attractions" />
            <StatCard icon={<Activity className="h-5 w-5" />} label="System Uptime" value={systemUptime ?? "Loading..."} hint="Automatically refreshed" />
          </>
        )}
      </div>

      {/* Content Rows */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivitySquare className="h-5 w-5 text-[#3A5B22]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ActionLink href="/super-admin/manage-admins/create" label="Add new admin" />
            <ActionLink href="/admin/news" label="Review news posts" />
            <ActionLink href="/admin/tourism" label="Review tourism places" />
            <ActionLink href="/portal-login" label="Switch account" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/5" />
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <ul className="space-y-2">
                {activity.map((a) => (
                  <li key={a.id} className="flex justify-between text-sm border-b py-1 border-gray-200">
                    <span>{a.message}</span>
                    <span className="text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Components ----------
function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string | number; hint?: string }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="text-[#3A5B22]">{icon}</div>
      </CardContent>
    </Card>
  );
}

function StatSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-12" />
      </CardContent>
    </Card>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex justify-between items-center rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
