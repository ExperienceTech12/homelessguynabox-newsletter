"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Eye,
  Send,
  Loader2,
  ArrowLeft,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NewsletterEditorProps {
  initialData?: {
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
  };
}

export function NewsletterEditor({ initialData }: NewsletterEditorProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "update");
  const [tags, setTags] = useState<string[]>(
    initialData?.tags ? JSON.parse(initialData.tags) : []
  );
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [pinned, setPinned] = useState(initialData?.pinned || false);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function save(publish = false) {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    publish ? setPublishing(true) : setSaving(true);

    try {
      const body = {
        title,
        content,
        excerpt: excerpt || null,
        category,
        tags: tags.length > 0 ? tags : null,
        featured,
        pinned,
        published: publish || initialData?.published || false,
        coverImage: coverImage || null,
      };

      const url = isEditing
        ? `/api/newsletters/${initialData.id}`
        : "/api/newsletters";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        return;
      }

      toast.success(publish ? "Published!" : "Saved!");
      router.push("/admin/newsletters");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">
            {isEditing ? "Edit Newsletter" : "New Newsletter"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => save(false)}
            disabled={saving || publishing}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            Save Draft
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => save(true)}
            disabled={saving || publishing}
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Send className="h-4 w-4 mr-1.5" />
            )}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Newsletter title..."
              className="bg-secondary/50 text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short preview text..."
              className="bg-secondary/50"
            />
          </div>

          <Tabs defaultValue="write" className="w-full">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-1.5" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your newsletter content in Markdown..."
                className="bg-secondary/50 min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports Markdown — headers, bold, links, lists, images, etc.
              </p>
            </TabsContent>
            <TabsContent value="preview">
              <div className="rounded-lg border border-border bg-card/50 p-6 min-h-[400px] prose-newsletter">
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">
                    Nothing to preview yet...
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category */}
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="bulletin">Bulletin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                className="bg-secondary/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={addTag}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="bg-secondary/50"
            />
          </div>

          {/* Options */}
          <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
            <Label>Options</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border"
                />
                Featured post
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-border"
                />
                Pin to top
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
