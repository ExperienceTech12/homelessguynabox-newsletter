import { SubscribeForm } from "@/components/subscribe-form";
import { Music, Bell, Zap, Gift } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe — HomelessGuyNABOX Newsletter",
  description: "Subscribe to get music updates, stream highlights, and community news.",
};

const perks = [
  {
    icon: Bell,
    title: "New Music Alerts",
    description: "Be the first to know when new songs are added to the stream.",
  },
  {
    icon: Zap,
    title: "Stream Updates",
    description: "Get notified about stream changes, schedules, and special events.",
  },
  {
    icon: Gift,
    title: "Exclusive Content",
    description: "Access to special playlists, behind-the-scenes, and promotions.",
  },
  {
    icon: Music,
    title: "Community News",
    description: "Stay connected with the HomelessGuyNABOX community.",
  },
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-text">Subscribe</span> to Our Newsletter
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join the community and never miss an update from HomelessGuyNABOX.
          Free forever, unsubscribe anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">What you&apos;ll get</h2>
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{perk.title}</h3>
                  <p className="text-xs text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="gradient-border p-6">
          <h2 className="text-lg font-semibold mb-1">Join the newsletter</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your details below to subscribe.
          </p>
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
