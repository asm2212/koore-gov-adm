"use client";

import { useState, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function UploadDocForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  const validateFile = (file: File | null) => {
    if (!file) return false;

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
      return false;
    }

    if (file.size > maxSize) {
      setMessage({ type: "error", text: "❌ File size must be under 6MB." });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = formRef.current;
    if (!form) {
      setLoading(false);
      return;
    }

    const formData = new FormData(form);
    const file = formData.get("file") as File | null;

    if (!validateFile(file)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/docs`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload document");

      setMessage({ type: "success", text: "✅ Document uploaded successfully!" });
      form.reset();
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "❌ Failed to upload document. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 bg-[#002214] rounded-xl border border-[#003322] shadow-lg"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          name="title"
          placeholder="Enter document title"
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
          disabled={loading}
          className="w-full p-2 rounded bg-[#00150C] text-white border border-[#003322] focus:ring-2 focus:ring-[#00C764]"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          name="category"
          required
          disabled={loading}
          className="w-full p-2 rounded bg-[#00150C] text-white border border-[#003322] focus:ring-2 focus:ring-[#00C764]"
        >
          <option value="public-plan">Public Plan</option>
          <option value="report">Report</option>
          <option value="post">Other Post</option>
        </select>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Upload File</label>
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          required
          disabled={loading}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (!validateFile(file)) e.target.value = "";
          }}
          className="w-full text-gray-300"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-[#00C764] text-white rounded hover:bg-[#009a4f] disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Document"}
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
