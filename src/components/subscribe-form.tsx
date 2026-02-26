"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SubscribeFormProps {
  compact?: boolean;
}

export function SubscribeForm({ compact = false }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to subscribe");
        return;
      }

      setSuccess(true);
      setEmail("");
      setName("");
      toast.success("Subscribed! Check your email to confirm.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={`flex items-center gap-2 ${compact ? "" : "p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"}`}>
        <Check className="h-5 w-5 text-emerald-400" />
        <span className="text-sm text-emerald-400">
          You&apos;re subscribed! Check your email for confirmation.
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-secondary/50"
        />
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-secondary/50"
      />
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-secondary/50"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Mail className="h-4 w-4 mr-2" />
        )}
        Subscribe to Newsletter
      </Button>
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <AlertCircle className="h-3 w-3" />
        No spam, unsubscribe anytime
      </p>
    </form>
  );
}
