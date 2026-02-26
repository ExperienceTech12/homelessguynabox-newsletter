import { prisma } from "@/lib/prisma";
import { NewsletterCard } from "@/components/newsletter-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { Badge } from "@/components/ui/badge";
import { Music, Radio, Headphones, Mic2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

const categories = [
  { key: "all", label: "All" },
  { key: "update", label: "Updates" },
  { key: "announcement", label: "Announcements" },
  { key: "promotion", label: "Promotions" },
  { key: "bulletin", label: "Bulletins" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const page = parseInt(params.page || "1");
  const limit = 10;

  const where = {
    published: true,
    ...(category && category !== "all" ? { category } : {}),
  };

  const [newsletters, total, featured] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.newsletter.count({ where }),
    prisma.newsletter.findFirst({
      where: { published: true, featured: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Radio className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">Live 24/7</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">HomelessGuyNABOX</span>
          <br />
          <span className="text-foreground">Newsletter</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
          Stay in the loop with the latest music drops, stream highlights,
          playlists, and community updates. 800+ songs and counting.
        </p>

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Headphones className="h-4 w-4 text-primary" />
            <span>800+ Songs</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Music className="h-4 w-4 text-neon" />
            <span>24/7 Stream</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mic2 className="h-4 w-4 text-amber-400" />
            <span>{total} Posts</span>
          </div>
        </div>

        {/* Inline subscribe */}
        <div className="max-w-md mx-auto">
          <SubscribeForm compact />
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="mb-10">
          <Link href={`/post/${featured.slug}`}>
            <div className="gradient-border p-6 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Featured
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {featured.category}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-muted-foreground">{featured.excerpt}</p>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const active = (category || "all") === cat.key;
          return (
            <Link
              key={cat.key}
              href={cat.key === "all" ? "/" : `/?category=${cat.key}`}
            >
              <Badge
                variant={active ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {cat.label}
              </Badge>
            </Link>
          );
        })}
      </div>

      {/* Newsletter list */}
      {newsletters.length === 0 ? (
        <div className="text-center py-20">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            Check back soon for updates, or subscribe to get notified!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {newsletters.map((nl) => (
            <NewsletterCard
              key={nl.id}
              slug={nl.slug}
              title={nl.title}
              excerpt={nl.excerpt}
              category={nl.category}
              tags={nl.tags}
              featured={nl.featured}
              pinned={nl.pinned}
              publishedAt={nl.publishedAt}
              createdAt={nl.createdAt}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}${category ? `&category=${category}` : ""}`}
            >
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                Previous
              </Badge>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}${category ? `&category=${category}` : ""}`}
            >
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                Next
              </Badge>
            </Link>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 mb-8 text-center">
        <div className="gradient-border p-8">
          <h2 className="text-2xl font-bold mb-2">
            Never Miss a Beat
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Subscribe to get the latest updates, new song additions, and exclusive
            stream promotions delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
