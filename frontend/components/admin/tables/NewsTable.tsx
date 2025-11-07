import { useState } from "react";

import { Button } from "@/components/ui/button";
import ContentFormModal from "@/components/admin/modals/ContentFormModal";
import { NewsItem } from "@/types/contentTypes";
import { useContentData } from "@/hooks/useContentData";
import CategoryBadge from "@/components/admin/ui/CategoryBadge";
import ThumbCluster from "@/components/admin/ui/ThumbCluster";
import RowActions from "@/components/admin/ui/RowActions";


export default function NewsTable() {
  const { data, loading, refresh } = useContentData<NewsItem>("news");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading news...</p>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>+ Add News</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-lg">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-4 rounded-tl-lg">Title</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Images</th>
              <th className="text-left p-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No news articles yet.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4"><CategoryBadge category={item.category || "GENERAL"} /></td>
                  <td className="p-4"><ThumbCluster images={item.images || []} /></td>
                  <td className="p-4">
                    <RowActions
                      onEdit={() => handleEdit(item)}
                      onDelete={() => {/* implement delete */}}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContentFormModal
        type="news"
        item={editingItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}