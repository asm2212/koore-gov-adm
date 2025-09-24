import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";

interface NewsDetail {
  id: string;
  title: string;
  content: string;
  images?: { url: string }[] | null;
  category?: string;
  createdAt: string;
}

async function getNewsDetail(id: string): Promise<NewsDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const result = await res.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const news = await getNewsDetail(params.id);
  if (!news) return notFound();

  // Use fallback image if no image is provided
  const imageUrl = news.images && news.images.length > 0 ? news.images[0].url : "/images/placeholder-news.jpg";
  const createdAt = news.createdAt ? new Date(news.createdAt) : new Date();

  return (
    <main className="min-h-screen bg-[#00150C] text-gray-200 py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Title & Category */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          {news.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          {news.category && (
            <span className="px-3 py-1 bg-[#00C764]/20 text-[#00C764] border border-[#00C764]/30 rounded-full text-sm font-medium">
              {news.category}
            </span>
          )}
          <time dateTime={createdAt.toISOString()} className="text-sm text-gray-400">
            {format(createdAt, "MMM d, yyyy")}
          </time>
        </div>

        {/* Image */}
        <div className="relative w-full h-60 sm:h-80 md:h-96 mb-8">
          <Image
            src={imageUrl}
            alt={news.title}
            fill
            className="object-cover rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
          />
        </div>

        {/* Content */}
        <article className="prose prose-lg prose-invert max-w-none text-gray-200 leading-relaxed">
          {/* Replace plain string with paragraphs */}
          {news.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 text-gray-200 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Back to News Link */}
        <div className="mt-12 text-center">
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-[#00C764] hover:text-[#00D96F] font-medium transition-colors duration-200"
          >
            ← Back to All Updates
          </a>
        </div>
      </div>
    </main>
  );
}