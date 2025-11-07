"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use your api helper to handle the request
      const data = await api.post<{ token: string; user: { role: string } }>("/auth/login", {
        email,
        password,
      });

      // Store the JWT token for future requests
      localStorage.setItem("portal_token", data.token);

      // Redirect based on role
      switch (data.user.role) {
        case "SUPER_ADMIN":
          router.push("/super-admin");
          break;
        case "ADMIN":
          router.push("/admin");
          break;
        default:
          router.push("/unauthorized");
      }
    } catch (err: any) {
      setError(err?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 bg-white rounded-3xl shadow-2xl transform transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
          Secure Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-6 rounded-lg text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
              className="mt-2 w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#3A5B22] focus:border-[#3A5B22] transition-all duration-200"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="mt-2 w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#3A5B22] focus:border-[#3A5B22] transition-all duration-200"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3A5B22] text-white font-semibold py-3 rounded-xl hover:bg-[#2e4819] transition-all duration-300 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Only authorized personnel can access this portal.
        </p>
      </div>
    </div>
  );
}
