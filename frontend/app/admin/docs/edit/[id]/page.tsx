"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EditDocPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/docs/${id}`)
      .then((res) => res.json())
      .then((data) => setDoc(data))
      .catch((err) => {
        console.error(err);
        setMessage({ type: "error", text: "❌ Failed to load document." });
      });
  }, [id]);

  const validateFile = (file: File | null) => {
    if (!file) return true; // No file selected is fine
    const maxSize = 6 * 1024 * 1024; // 6MB
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      setMessage({ type: "error", text: "❌ Unsupported file type." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return false;
    }

    if (file.size > maxSize) {
      setMessage({ type: "error", text: "❌ File size must be under 6MB." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File | null;

    if (!validateFile(file)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/docs/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update document");

      setMessage({ type: "success", text: "✅ Document updated successfully!" });
      router.push("/admin/docs");
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "❌ Failed to update document." });
    } finally {
      setLoading(false);
    }
  };

  if (!doc)
    return <p className="text-gray-400 text-center mt-12">Loading document...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 bg-[#002214] rounded-xl border border-[#003322] shadow-lg"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          name="title"
          placeholder="Title"
          defaultValue={doc.title}
          required
          disabled={loading}
          className="w-full p-2 rounded bg-[#00150C] text-white border border-[#003322] focus:ring-2 focus:ring-[#00C764]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Optional description..."
          defaultValue={doc.description}
          disabled={loading}
          className="w-full p-2 rounded bg-[#00150C] text-white border border-[#003322] focus:ring-2 focus:ring-[#00C764]"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          name="category"
          defaultValue={doc.category}
          required
          disabled={loading}
          className="w-full p-2 rounded bg-[#00150C] text-white border border-[#003322] focus:ring-2 focus:ring-[#00C764]"
        >
          <option value="public-plan">Public Plan</option>
          <option value="report">Report</option>
          <option value="post">Other Post</option>
        </select>
      </div>

      {/* Current File */}
      <p className="text-sm text-gray-400">
        Current File: {doc.fileUrl.split("/").pop()}
      </p>

      {/* Replace File */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Replace File (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          disabled={loading}
          onChange={(e) => validateFile(e.target.files?.[0] || null)}
          className="w-full text-gray-300"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-[#00C764] text-white rounded hover:bg-[#009a4f] disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Document"}
      </button>

      {/* Feedback Message */}
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
