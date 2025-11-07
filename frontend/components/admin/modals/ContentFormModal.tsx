"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MAX_IMAGE_SIZE_MB = 6;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function ContentFormModal({
  type,
  item,
  isOpen,
  onClose,
  onSuccess,
}: {
  type: "news" | "tourism";
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(item?.title || item?.name || "");
  const [content, setContent] = useState(item?.content || "");
  const [description, setDescription] = useState(item?.description || "");
  const [location, setLocation] = useState(item?.location || "");
  const [category, setCategory] = useState(item?.category || "GENERAL");
  const [language, setLanguage] = useState(item?.language || "EN");
  const [existingImages, setExistingImages] = useState(item?.images || []);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = existingImages.length + newFiles.length;

  const validateFiles = (files: FileList | null) => {
    if (!files) return [];
    const valid: { file: File; preview: string }[] = [];
    const failures: string[] = [];

    Array.from(files).forEach((file) => {
      const sizeMB = file.size / 1024 / 1024;
      if (!ALLOWED_TYPES.includes(file.type)) {
        failures.push(`${file.name}: unsupported`);
      } else if (sizeMB > MAX_IMAGE_SIZE_MB) {
        failures.push(`${file.name}: >${MAX_IMAGE_SIZE_MB}MB`);
      } else {
        valid.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    if (failures.length) {
      toast.error(`Rejected: ${failures.slice(0, 3).join(", ")}${failures.length > 3 ? "..." : ""}`);
    }

    return valid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = validateFiles(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("portal_token");
    if (!token) return toast.error("Not authenticated");

    const formData = new FormData();

    if (type === "news") {
      if (!title || !content) return toast.error("Title and content required");
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
    } else {
      if (!title || !location) return toast.error("Name and location required");
      formData.append("name", title);
      formData.append("description", description);
      formData.append("location", location);
    }
    formData.append("language", language);
    newFiles.forEach(({ file }) => formData.append("images", file));
    formData.append("keepImages", JSON.stringify(existingImages));

    const method = item ? "PUT" : "POST";
    const endpoint = `${API_BASE}/${type}${item ? `/${item.id}` : ""}`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success(`${type === "news" ? "News" : "Tourism"} ${item ? "updated" : "created"}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Save failed. Check connection.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-card border border-border rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold">
            {item ? "Edit" : "Create"} {type === "news" ? "News" : "Tourism Spot"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div>
            <Label>{type === "news" ? "Title" : "Name"}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {type === "news" ? (
            <>
              <div>
                <Label>Content</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} required className="min-h-32" />
              </div>
              <div>
                <Label>Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded">
                  <option value="GENERAL">📘 General</option>
                  <option value="TRENDING">🔥 Trending</option>
                  <option value="TODAY">📅 Today</option>
                  <option value="WEEKLY">📆 Weekly</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-24" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            </>
          )}

          <div>
            <Label>Language</Label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
              <option value="EN">English</option>
              <option value="AM">Amharic</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label>Images ({totalImages})</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent"
            >
              <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm">
                <span className="font-medium text-accent">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to {MAX_IMAGE_SIZE_MB}MB</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </div>

            {(existingImages.length > 0 || newFiles.length > 0) && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {existingImages.map((img: { url: string }, i: number) => (
                  <div key={`ex-${i}`} className="relative group">
                    <Image src={img.url} alt="img" width={80} height={80} className="w-full h-20 object-cover rounded" unoptimized />
                    <button type="button" onClick={() => removeExistingImage(i)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {newFiles.map((nf, i) => (
                  <div key={`nf-${i}`} className="relative group">
                    <Image src={nf.preview} alt="preview" width={80} height={80} className="w-full h-20 object-cover rounded" />
                    <button type="button" onClick={() => removeNewFile(i)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}