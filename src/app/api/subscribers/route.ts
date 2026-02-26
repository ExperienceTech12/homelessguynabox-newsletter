import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomBytes } from "crypto";

// POST — subscribe
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      if (existing.active && existing.confirmed) {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      // Reactivate
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          active: true,
          confirmed: false,
          confirmToken: randomBytes(32).toString("hex"),
          unsubscribedAt: null,
          name: name || existing.name,
        },
      });
      return NextResponse.json({ message: "Re-subscribed! Check email to confirm." });
    }

    await prisma.subscriber.create({
      data: {
        email: emailLower,
        name: name || null,
        confirmToken: randomBytes(32).toString("hex"),
        unsubToken: randomBytes(32).toString("hex"),
        confirmed: true, // Auto-confirm for now until email is set up
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — list subscribers (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscribers);
}
