"use client";

import useSWR from "swr";
import { FileText, BookOpen, ClipboardList } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const fetcher = (url: string) => fetch(url).then(res => res.json());

const getIconByCategory = (category: string) => {
  switch (category) {
    case "public-plan":
      return <ClipboardList className="w-6 h-6 text-[#00C764]" />;
    case "report":
      return <FileText className="w-6 h-6 text-[#00C764]" />;
    case "post":
      return <BookOpen className="w-6 h-6 text-[#00C764]" />;
    default:
      return <FileText className="w-6 h-6 text-[#00C764]" />;
  }
};

export default function DocsPage() {
  const { data: docs, error, isLoading } = useSWR(`${API_BASE}/docs`, fetcher);

  if (error) return <p className="text-red-500 text-center mt-12">Failed to load documents.</p>;
  if (isLoading) return <p className="text-gray-400 text-center mt-12">Loading documents...</p>;

  // Group docs by category
  const groupedDocs: Record<string, any[]> = {
    "public-plan": [],
    report: [],
    post: [],
  };

  (docs || []).forEach((doc: any) => {
    if (groupedDocs[doc.category]) groupedDocs[doc.category].push(doc);
  });

  const docsSections = [
    {
      title: "Public Plan",
      desc: "Strategic plans, development agendas, and initiatives for the public.",
      category: "public-plan",
    },
    {
      title: "Reports",
      desc: "Annual, quarterly, and project-based reports for transparency.",
      category: "report",
    },
    {
      title: "Other Posts",
      desc: "Community updates, notices, and public announcements.",
      category: "post",
    },
  ];

  return (
    <main className="min-h-screen bg-[#00150C] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-[#00C764]">
          Public Documents
        </h1>
        <p className="text-gray-300 mb-10">
          Access official documents, reports, and plans published for the community.
        </p>

        {/* Sections */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docsSections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{section.desc}</p>
              <div className="flex flex-col gap-3">
                {(groupedDocs[section.category] || []).map((doc: any) => (
                  <a
                    key={doc.id}
                    href={`${API_BASE}${doc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#002214] border border-[#003322] rounded-2xl p-4 hover:scale-105 transition-transform hover:border-[#00C764] focus:ring-2 focus:ring-[#00C764] focus:outline-none shadow-lg flex items-center gap-3"
                  >
                    <span className="text-xl">{getIconByCategory(doc.category)}</span>
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      {doc.description && <p className="text-sm text-gray-400">{doc.description}</p>}
                    </div>
                  </a>
                ))}
                {groupedDocs[section.category].length === 0 && (
                  <p className="text-gray-500 italic">No documents available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
