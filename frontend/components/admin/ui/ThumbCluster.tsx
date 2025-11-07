import Image from "next/image";

export default function ThumbCluster({ images }: { images: { url: string }[] }) {
  return (
    <div className="flex gap-2">
      {images.slice(0, 3).map((img, i) => (
        <div
          key={i}
          className="w-12 h-12 relative rounded-lg overflow-hidden border border-border"
        >
          <Image
            src={img.url}
            alt="preview"
            width={48}
            height={48}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
      {images.length > 3 && (
        <span className="flex items-center justify-center w-12 h-12 text-xs bg-muted rounded-lg border border-border text-muted-foreground font-medium">
          +{images.length - 3}
        </span>
      )}
    </div>
  );
}