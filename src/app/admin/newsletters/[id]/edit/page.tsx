"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { NewsletterEditor } from "@/components/newsletter-editor";

interface NewsletterData {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  tags: string | null;
  featured: boolean;
  pinned: boolean;
  published: boolean;
  coverImage: string | null;
}

export default function EditNewsletterPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetch(`/api/newsletters/${params.id}`)
        .then((r) => r.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => {
          router.push("/admin/newsletters");
        });
    }
  }, [status, params.id, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return <NewsletterEditor initialData={data} />;
}
