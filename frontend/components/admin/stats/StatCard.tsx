"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

type StatCardProps = {
  title: string;
  value: number;
  color?: "blue" | "green" | "purple";
  icon: string;
  loading?: boolean;
  refreshKey: number;
  tooltip?: string;
  link?: string;
  onClick?: () => void;
};

// Dynamically import CountUp to avoid SSR issues
const CountUp = dynamic(() => import("react-countup"), { ssr: false });

function AnimatedCount({ value, refreshKey }: { value: number; refreshKey: number }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <span>{value}</span>;
  }

  return (
    <CountUp
      key={refreshKey}
      start={0}
      end={value}
      duration={1.2}
      separator=","
    />
  );
}

// Reusable Tooltip Wrapper
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <TooltipPrimitive.Provider delayDuration={300} disableHoverableContent>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className="text-sm bg-gray-800 text-white px-3 py-1.5 rounded-md shadow-lg z-50 max-w-xs break-words animate-fade-in"
          side="top"
          align="center"
          sideOffset={8}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-gray-800" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

export default function StatCard({
  title,
  value,
  color = "blue",
  icon,
  loading = false,
  refreshKey,
  tooltip,
  link,
  onClick,
}: StatCardProps) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100",
    green: "border-green-200 bg-green-50 text-green-800 hover:bg-green-100",
    purple: "border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100",
  };

  const baseClasses =
    "border-l-4 p-5 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-4";

  const cardContent = (
    <div className="flex items-center w-full">
      <div className="flex-1 min-w-0">
        <Tooltip content={tooltip || `View ${title}`}>
          <p className="text-sm font-medium text-muted-foreground truncate" role="heading" aria-level={3}>
            {title}
          </p>
        </Tooltip>
        {loading ? (
          <Skeleton className="h-7 w-16 mt-1" />
        ) : (
          <p className="text-2xl font-bold mt-1 tabular-nums">
            <AnimatedCount value={value} refreshKey={refreshKey} />
          </p>
        )}
      </div>
      <span className="text-4xl flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
    </div>
  );

  if (link) {
    return (
      <Link href={link} legacyBehavior>
        <a
          className={`${baseClasses} ${colorClasses[color]} cursor-pointer`}
          onClick={onClick}
          aria-label={`View ${title}`}
        >
          {cardContent}
        </a>
      </Link>
    );
  }

  return (
    <div
      className={`${baseClasses} ${colorClasses[color]} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : "region"}
      tabIndex={onClick ? 0 : -1}
      aria-label={`View ${title}`}
    >
      {cardContent}
    </div>
  );
}