"use client";

import useSWR, { mutate } from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Toaster, toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const fetcher = (url: string) => fetch(url).then(res => res.json());

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "📄";
  if (type.includes("word")) return "📝";
  if (type.includes("excel")) return "📊";
  if (type.includes("image")) return "🖼️";
  return "📁";
};

export default function AdminDocsPage() {
  const { data: docs, error, isLoading } = useSWR(`${API_BASE}/docs`, fetcher);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/docs/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete document");

      toast.success(`✅ "${title}" deleted successfully`);
      mutate(`${API_BASE}/docs`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "❌ Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (error) return <p className="text-red-500">Failed to load documents.</p>;
  if (isLoading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="p-4">
      <Toaster richColors position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">📂 Docs Management</h1>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/docs/upload">+ Add New Doc</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {docs.length === 0 ? (
          <p className="text-gray-400 italic">No documents uploaded yet.</p>
        ) : (
          docs.map((doc: any) => (
            <Card key={doc.id}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">{getFileIcon(doc.fileType)}</span>
                  <span>{doc.title}</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/docs/edit/${doc.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={deletingId === doc.id}
                    className="text-red-600 hover:text-red-800 flex items-center text-sm"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    {deletingId === doc.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-gray-400">{doc.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                </p>
                <a
                  href={`${API_BASE}${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00C764] underline text-sm"
                >
                  View File ({doc.fileType})
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
