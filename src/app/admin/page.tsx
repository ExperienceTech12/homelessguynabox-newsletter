"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Users,
  Plus,
  BarChart3,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface Stats {
  totalNewsletters: number;
  published: number;
  drafts: number;
  totalSubscribers: number;
  activeSubscribers: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/stats")
        .then((r) => r.json())
        .then(setStats)
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const cards = [
    {
      title: "Newsletters",
      value: stats?.totalNewsletters || 0,
      subtitle: `${stats?.published || 0} published, ${stats?.drafts || 0} drafts`,
      icon: Newspaper,
      href: "/admin/newsletters",
      color: "text-primary",
    },
    {
      title: "Subscribers",
      value: stats?.totalSubscribers || 0,
      subtitle: `${stats?.activeSubscribers || 0} active`,
      icon: Users,
      href: "/admin/subscribers",
      color: "text-neon",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {session.user?.name || "Admin"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/newsletters/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" />
              New Post
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <div className="rounded-xl border border-border bg-card/50 p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  <Badge variant="outline" className="text-xs">
                    View All
                  </Badge>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/newsletters/new">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2 text-primary" />
              New Newsletter
            </Button>
          </Link>
          <Link href="/admin/newsletters">
            <Button variant="outline" className="w-full justify-start">
              <Newspaper className="h-4 w-4 mr-2 text-blue-400" />
              Manage Posts
            </Button>
          </Link>
          <Link href="/admin/subscribers">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2 text-emerald-400" />
              Subscribers
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2 text-amber-400" />
              View Site
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
