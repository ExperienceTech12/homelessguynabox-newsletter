import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

// GET — list newsletters (public: published only, admin: all)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = !!session?.user?.role;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where = {
    ...(isAdmin ? {} : { published: true }),
    ...(category ? { category } : {}),
  };

  const [newsletters, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true } } },
    }),
    prisma.newsletter.count({ where }),
  ]);

  return NextResponse.json({
    newsletters,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST — create newsletter (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, excerpt, category, tags, featured, pinned, published, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let slug = slugify(title);

    // Ensure unique slug
    const existing = await prisma.newsletter.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        category: category || "update",
        tags: tags ? JSON.stringify(tags) : null,
        featured: featured || false,
        pinned: pinned || false,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id || null,
      },
    });

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error) {
    console.error("Create newsletter error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
