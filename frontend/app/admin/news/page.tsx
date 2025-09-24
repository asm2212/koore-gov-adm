"use client";

import { useState, useCallback, memo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentFormModal from "@/components/admin/modals/ContentFormModal";
import RowActions from "@/components/admin/ui/RowActions";
import ThumbCluster from "@/components/admin/ui/ThumbCluster";
import CategoryBadge from "@/components/admin/ui/CategoryBadge";
import { Button } from "@/components/ui/button";
import { useContentData } from "@/hooks/useContentData";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import type { NewsItem } from "@/types/contentTypes";

// ✅ Extracted table row into memoized component for cleaner code
const NewsRow = memo(
  ({
    item,
    onEdit,
    onDelete,
    deleting,
  }: {
    item: NewsItem;
    onEdit: (item: NewsItem) => void;
    onDelete: (id: number) => void;
    deleting: boolean;
  }) => (
    <tr
      key={item.id}
      className="hover:bg-muted/50 transition-colors duration-150"
      role="row"
    >
      <td className="px-4 py-4 font-medium" role="cell">
        {item.title}
      </td>
      <td className="px-4 py-4" role="cell">
        <CategoryBadge category={item.category || "GENERAL"} />
      </td>
      <td className="px-4 py-4" role="cell">
        <ThumbCluster images={item.images || []} />
      </td>
      <td className="px-4 py-4" role="cell">
        <RowActions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(Number(item.id))}
          deleting={deleting}
        />
      </td>
    </tr>
  )
);

NewsRow.displayName = "NewsRow";

export default function NewsPage() {
  const { data, loading, refresh } = useContentData<NewsItem>("news");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // ✅ useCallback for stable references
  const { deleteItem, deleting } = useDeleteItem({
    onSuccess: refresh,
    entityName: "News Article",
  });

  const handleEdit = useCallback((item: NewsItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => deleteItem("news", id),
    [deleteItem]
  );

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground" aria-live="polite">
          Loading news articles...
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">News Management</h1>

      {/* CTA Button */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700"
          aria-label="Add new news article"
        >
          + Add News
        </Button>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg border border-border shadow-sm"
        role="table"
        aria-label="News articles table"
      >
        <table className="w-full table-auto">
          <thead className="bg-muted text-muted-foreground text-sm uppercase tracking-wide">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold rounded-tl-lg">
                Title
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                Images
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground italic"
                  role="cell"
                >
                  No news articles found.{" "}
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                  >
                    Click here to add one.
                  </button>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <NewsRow
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  deleting={deleting === item.id}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ContentFormModal
        type="news"
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </AdminLayout>
  );
}
