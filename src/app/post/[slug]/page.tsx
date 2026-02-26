import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscribeForm } from "@/components/subscribe-form";
import { Calendar, ArrowLeft, Music } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const newsletter = await prisma.newsletter.findUnique({
    where: { slug, published: true },
  });

  if (!newsletter) return { title: "Not Found" };

  return {
    title: `${newsletter.title} — HomelessGuyNABOX Newsletter`,
    description: newsletter.excerpt || newsletter.title,
    openGraph: {
      title: newsletter.title,
      description: newsletter.excerpt || newsletter.title,
      type: "article",
      publishedTime: newsletter.publishedAt?.toISOString(),
    },
  };
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!newsletter) notFound();

  const parsedTags: string[] = newsletter.tags
    ? JSON.parse(newsletter.tags)
    : [];
  const date = newsletter.publishedAt || newsletter.createdAt;

  const [prev, next] = await Promise.all([
    prisma.newsletter.findFirst({
      where: { published: true, publishedAt: { lt: date } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.newsletter.findFirst({
      where: { published: true, publishedAt: { gt: date } },
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const categoryColors: Record<string, string> = {
    bulletin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    promotion: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    update: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    announcement: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Newsletter
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className={categoryColors[newsletter.category] || categoryColors.update}
            >
              {newsletter.category}
            </Badge>
            {newsletter.featured && (
              <Badge className="bg-primary/20 text-primary border-primary/30">
                Featured
              </Badge>
            )}
            {parsedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {newsletter.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{format(date, "MMMM d, yyyy")}</span>
            </div>
            {newsletter.author && <span>by {newsletter.author.name}</span>}
          </div>
        </header>

        <div className="prose-newsletter mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {newsletter.content}
          </ReactMarkdown>
        </div>

        {/* Stream promo */}
        <div className="gradient-border p-6 mb-8 text-center">
          <Music className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Enjoying the content?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tune in to our 24/7 music stream — 800+ songs and growing!
          </p>
          <a href="https://homelessguynabox.org" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90">
              <Music className="h-4 w-4 mr-2" />
              Listen Now
            </Button>
          </a>
        </div>

        {/* Subscribe CTA */}
        <div className="rounded-xl border border-border bg-card/50 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get newsletter updates delivered to you.
          </p>
          <SubscribeForm compact />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          {prev ? (
            <Link href={`/post/${prev.slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="max-w-[200px] truncate">{prev.title}</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/post/${next.slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <span className="max-w-[200px] truncate">{next.title}</span>
                <ArrowLeft className="h-4 w-4 ml-1.5 rotate-180" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>
    </div>
  );
}
