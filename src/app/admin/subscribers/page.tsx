"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trash2,
  Loader2,
  ArrowLeft,
  Check,
  X,
  Mail,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  confirmed: boolean;
  createdAt: string;
  unsubscribedAt: string | null;
}

export default function AdminSubscribersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    const res = await fetch("/api/subscribers");
    const data = await res.json();
    setSubscribers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    if (status === "authenticated") fetchSubscribers();
  }, [status, router, fetchSubscribers]);

  async function deleteSubscriber(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Subscriber removed");
      fetchSubscribers();
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const active = subscribers.filter((s) => s.active);
  const inactive = subscribers.filter((s) => !s.active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            {active.length} active, {inactive.length} unsubscribed
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-20">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No subscribers yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className={`flex items-center gap-4 p-4 rounded-lg border bg-card/50 transition-colors ${
                sub.active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {sub.name || sub.email}
                  </span>
                  {sub.active ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                      <Check className="h-2.5 w-2.5 mr-0.5" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      <X className="h-2.5 w-2.5 mr-0.5" />
                      Unsubscribed
                    </Badge>
                  )}
                  {sub.confirmed && (
                    <Badge variant="outline" className="text-[10px]">
                      Confirmed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{sub.email}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(sub.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                onClick={() => deleteSubscriber(sub.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
