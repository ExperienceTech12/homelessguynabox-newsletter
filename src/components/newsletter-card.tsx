import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pin, Star } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface NewsletterCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  tags: string | null;
  featured: boolean;
  pinned: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

const categoryColors: Record<string, string> = {
  bulletin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  promotion: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  update: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  announcement: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export function NewsletterCard({
  slug,
  title,
  excerpt,
  category,
  tags,
  featured,
  pinned,
  publishedAt,
  createdAt,
}: NewsletterCardProps) {
  const date = publishedAt || createdAt;
  const parsedTags: string[] = tags ? JSON.parse(tags) : [];

  return (
    <Link href={`/post/${slug}`}>
      <article
        className={`group relative rounded-xl border p-5 transition-all duration-200 hover:border-primary/30 hover:bg-card/80 ${
          featured
            ? "border-primary/20 bg-primary/5"
            : "border-border bg-card/50"
        }`}
      >
        {/* Status indicators */}
        <div className="flex items-center gap-2 mb-3">
          {pinned && (
            <Pin className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          )}
          {featured && (
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
          )}
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0 ${categoryColors[category] || categoryColors.update}`}
          >
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{format(date, "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}

        {/* Tags + time ago */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {parsedTags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none glow-purple" />
      </article>
    </Link>
  );
}
