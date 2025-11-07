export default function CategoryBadge({ category }: { category: string }) {
  const styles = {
    TRENDING: "bg-red-100 text-red-800 border-red-200",
    TODAY: "bg-blue-100 text-blue-800 border-blue-200",
    WEEKLY: "bg-yellow-100 text-yellow-800 border-yellow-200",
    GENERAL: "bg-gray-100 text-gray-800 border-gray-200",
  }[category] || "bg-gray-100 text-gray-800";

  const labels = {
    TRENDING: "🔥 Trending",
    TODAY: "📅 Today",
    WEEKLY: "📆 Weekly",
    GENERAL: "📘 General",
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${styles}`}
    >
      {labels[category as keyof typeof labels] || category}
    </span>
  );
}