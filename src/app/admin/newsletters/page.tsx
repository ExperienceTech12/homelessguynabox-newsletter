"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Pin,
  Star,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Newsletter {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  featured: boolean;
  pinned: boolean;
  publishedAt: string | null;
  createdAt: string;
  author: { name: string } | null;
}

export default function AdminNewslettersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsletters = useCallback(async () => {
    const res = await fetch("/api/newsletters?limit=50");
    const data = await res.json();
    setNewsletters(data.newsletters || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated") fetchNewsletters();
  }, [status, router, fetchNewsletters]);

  async function togglePublish(id: string, currentState: boolean) {
    const res = await fetch(`/api/newsletters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !currentState }),
    });
    if (res.ok) {
      toast.success(currentState ? "Unpublished" : "Published");
      fetchNewsletters();
    }
  }

  async function togglePin(id: string, currentState: boolean) {
    const res = await fetch(`/api/newsletters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !currentState }),
    });
    if (res.ok) {
      toast.success(currentState ? "Unpinned" : "Pinned");
      fetchNewsletters();
    }
  }

  async function toggleFeatured(id: string, currentState: boolean) {
    const res = await fetch(`/api/newsletters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !currentState }),
    });
    if (res.ok) {
      toast.success(currentState ? "Unfeatured" : "Featured");
      fetchNewsletters();
    }
  }

  async function deleteNewsletter(id: string) {
    if (!confirm("Delete this newsletter? This cannot be undone.")) return;
    const res = await fetch(`/api/newsletters/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      fetchNewsletters();
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    bulletin: "bg-blue-500/20 text-blue-400",
    promotion: "bg-purple-500/20 text-purple-400",
    update: "bg-emerald-500/20 text-emerald-400",
    announcement: "bg-amber-500/20 text-amber-400",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Newsletters</h1>
            <p className="text-sm text-muted-foreground">
              {newsletters.length} total
            </p>
          </div>
        </div>
        <Link href="/admin/newsletters/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" />
            New Post
          </Button>
        </Link>
      </div>

      {newsletters.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">No newsletters yet.</p>
          <Link href="/admin/newsletters/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" />
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {newsletters.map((nl) => (
            <div
              key={nl.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {nl.pinned && <Pin className="h-3 w-3 text-amber-400 fill-amber-400" />}
                  {nl.featured && <Star className="h-3 w-3 text-primary fill-primary" />}
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${categoryColors[nl.category] || ""}`}
                  >
                    {nl.category}
                  </Badge>
                  <Badge
                    variant={nl.published ? "default" : "secondary"}
                    className={`text-[10px] ${nl.published ? "bg-emerald-500/20 text-emerald-400" : ""}`}
                  >
                    {nl.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <h3 className="font-medium truncate">{nl.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {nl.publishedAt
                    ? `Published ${format(new Date(nl.publishedAt), "MMM d, yyyy")}`
                    : `Created ${format(new Date(nl.createdAt), "MMM d, yyyy")}`}
                  {nl.author && ` by ${nl.author.name}`}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePublish(nl.id, nl.published)}
                  title={nl.published ? "Unpublish" : "Publish"}
                >
                  {nl.published ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-emerald-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePin(nl.id, nl.pinned)}
                  title={nl.pinned ? "Unpin" : "Pin"}
                >
                  <Pin className={`h-4 w-4 ${nl.pinned ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleFeatured(nl.id, nl.featured)}
                  title={nl.featured ? "Unfeature" : "Feature"}
                >
                  <Star className={`h-4 w-4 ${nl.featured ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                </Button>
                <Link href={`/admin/newsletters/${nl.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteNewsletter(nl.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
