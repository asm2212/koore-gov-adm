"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import api from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN"; // keep aligned with backend allowed roles
};

type CreateAdminResponse = {
  message: string;
  admin: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
    createdAt?: string;
  };
};

export default function CreateAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordStrength = usePasswordStrength(form.password);
  const isPasswordValid = passwordStrength === "Strong";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Password does not meet requirements.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // backend: only SUPER_ADMIN can hit this route
      const data = await api.post<CreateAdminResponse>("/admins/create", form);
      setSuccess(data?.message || "Admin created successfully!");
      setForm({ name: "", email: "", password: "", role: "ADMIN" });

      setTimeout(() => router.push("/super-admin"), 900);
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Failed to create admin.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Create New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-50 text-green-700 p-3 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {passwordStrength && (
                <p
                  className={`mt-1 text-sm ${
                    passwordStrength === "Weak"
                      ? "text-red-600"
                      : passwordStrength === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-400 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
              >
                {/* Only allow ADMIN creation from UI to match backend */}
                <option className="text-black" value="ADMIN">👑 Admin</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !isPasswordValid}>
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
