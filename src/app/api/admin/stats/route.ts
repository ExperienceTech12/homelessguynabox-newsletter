import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalNewsletters, published, totalSubscribers, activeSubscribers] =
    await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { published: true } }),
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { active: true } }),
    ]);

  return NextResponse.json({
    totalNewsletters,
    published,
    drafts: totalNewsletters - published,
    totalSubscribers,
    activeSubscribers,
  });
}
