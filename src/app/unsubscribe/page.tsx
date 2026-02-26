"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to unsubscribe");
        return;
      }

      setDone(true);
      toast.success("You have been unsubscribed.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Check className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Unsubscribed</h1>
        <p className="text-muted-foreground">
          You&apos;ve been removed from our mailing list. We&apos;re sorry to see you go!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-2xl font-bold mb-2 text-center">Unsubscribe</h1>
      <p className="text-muted-foreground text-center mb-8">
        Enter your email to unsubscribe from our newsletter.
      </p>

      <form onSubmit={handleUnsubscribe} className="space-y-4">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-secondary/50"
        />
        <Button type="submit" disabled={loading} variant="destructive" className="w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Unsubscribe
        </Button>
      </form>
    </div>
  );
}
