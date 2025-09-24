"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Pencil, Trash2, RotateCcw, UserPlus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getToken, getRole } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  active: boolean;
};

export default function ManageAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const token = getToken();

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ data: Admin[] }>(`${API_URL}/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to load admin accounts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check auth and load data
  useEffect(() => {
    if (!token) {
      router.replace("/portal-login");
      return;
    }

    const userRole = getRole(token);
    if (!userRole || userRole !== "SUPER_ADMIN") {
      router.replace("/unauthorized");
      return;
    }

    fetchAdmins();
  }, [token, router, fetchAdmins]); // ✅ All dependencies included

  const toggleActive = async (id: string, active: boolean) => {
    if (!token) return;
    try {
      await axios.patch(
        `${API_URL}/admins/${id}/${active ? "deactivate" : "activate"}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins(); // Refresh list
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update admin status.";
      alert(message);
    }
  };

  const resetPassword = async (id: string) => {
    if (!token || !confirm("Reset password for this admin?")) return;
    try {
      await axios.post(
        `${API_URL}/admins/${id}/reset-password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password reset. The admin will receive an email with instructions.");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to reset password.";
      alert(message);
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin({ ...admin });
    setEditOpen(true);
  };

  const handleEditChange = (field: keyof Admin, value: any) => {
    setSelectedAdmin((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const saveAdminChanges = async () => {
    if (!selectedAdmin || !token) return;
    try {
      await axios.put(
        `${API_URL}/admins/${selectedAdmin.id}`,
        selectedAdmin,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditOpen(false);
      fetchAdmins();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to save changes.";
      alert(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Admins</h1>
        <Link href="/super-admin/manage-admins/create">
          <Button className="bg-[#3A5B22] hover:bg-[#2e4819] text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Create Admin
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 flex items-center gap-2 border border-red-500/50 bg-red-900/30 text-red-200 px-4 py-2 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Admins Table */}
      <Card className="bg-[#001A0F] border border-[#002214] shadow-sm">
        <CardHeader>
          <CardTitle className="text-white">All Admin Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-[#002214]" />
              <Skeleton className="h-12 w-full bg-[#002214]" />
              <Skeleton className="h-12 w-full bg-[#002214]" />
            </div>
          ) : admins.length === 0 ? (
            <p className="text-sm text-gray-400">No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-[#002214] rounded-lg">
                <thead className="bg-[#002214]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-200">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-200">Email</th>
                    <th className="px-4 py-2 font-medium text-gray-200">Role</th>
                    <th className="px-4 py-2 font-medium text-gray-200">Status</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id} className="border-t border-[#002214] hover:bg-[#002214]/50 transition-colors">
                      <td className="px-4 py-2 text-white">{admin.name}</td>
                      <td className="px-4 py-2 text-gray-300">{admin.email}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className="text-xs uppercase">
                          {admin.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        {admin.active ? (
                          <Badge className="bg-green-600/20 text-green-300 border border-green-700/30">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-700/30 text-gray-400 border border-gray-600">
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-[#00C764] text-[#00C764] hover:bg-[#00C764]/10"
                          onClick={() => openEditModal(admin)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={admin.active ? "destructive" : "outline"}
                          onClick={() => toggleActive(admin.id, admin.active)}
                        >
                          {admin.active ? (
                            <Trash2 className="h-4 w-4" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                          onClick={() => resetPassword(admin.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#001A0F] border border-[#002214] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Admin</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-gray-200">Name</Label>
                <Input
                  value={selectedAdmin.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="bg-[#002214] border-[#003322] text-white"
                />
              </div>
              <div>
                <Label className="text-gray-200">Email</Label>
                <Input
                  value={selectedAdmin.email}
                  onChange={(e) => handleEditChange("email", e.target.value)}
                  className="bg-[#002214] border-[#003322] text-white"
                />
              </div>
              <div>
                <Label className="text-gray-200">Role</Label>
                <Select
                  value={selectedAdmin.role}
                  onValueChange={(value) => handleEditChange("role", value as "ADMIN" | "SUPER_ADMIN")}
                >
                  <SelectTrigger className="bg-[#002214] border-[#003322] text-white">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#001A0F] border-[#003322]">
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-200">Status</Label>
                <Select
                  value={selectedAdmin.active ? "active" : "inactive"}
                  onValueChange={(value) => handleEditChange("active", value === "active")}
                >
                  <SelectTrigger className="bg-[#002214] border-[#003322] text-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#001A0F] border-[#003322]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="text-gray-300"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#3A5B22] hover:bg-[#2e4819] text-white"
              onClick={saveAdminChanges}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}