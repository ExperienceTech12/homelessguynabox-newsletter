import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

// GET — single newsletter by id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!newsletter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(newsletter);
}

// PUT — update newsletter (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { title, content, excerpt, category, tags, featured, pinned, published, coverImage } = body;

    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Regenerate slug if title changed
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = slugify(title);
      const conflict = await prisma.newsletter.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    // If being published for the first time
    const publishedAt =
      published && !existing.published ? new Date() : existing.publishedAt;

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        slug,
        excerpt: excerpt !== undefined ? excerpt || null : undefined,
        coverImage: coverImage !== undefined ? coverImage || null : undefined,
        category: category || existing.category,
        tags: tags !== undefined ? (tags ? JSON.stringify(tags) : null) : undefined,
        featured: featured !== undefined ? featured : undefined,
        pinned: pinned !== undefined ? pinned : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt,
      },
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Update newsletter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete newsletter (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.newsletter.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
