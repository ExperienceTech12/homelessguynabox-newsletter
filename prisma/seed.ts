import "dotenv/config";

async function main() {
  const { PrismaClient } = await import("../src/generated/prisma/client.js");
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
  const bcrypt = await import("bcryptjs");

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  });
  const prisma = new PrismaClient({ adapter });

  try {
    // Create default admin
    const hashedPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.admin.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });

    console.log("Created admin:", admin.username);

    // Create sample newsletter posts
    const samplePosts = [
      {
        title: "Welcome to the HomelessGuyNABOX Newsletter!",
        slug: "welcome-to-the-newsletter",
        content: `# Welcome!\n\nWe're excited to launch the official HomelessGuyNABOX Newsletter!\n\nThis is your go-to place for:\n\n- **New song additions** — Be the first to know when tracks drop\n- **Stream updates** — Schedule changes, special events, and more\n- **Community highlights** — Shoutouts, fan favorites, and listener stories\n- **Exclusive content** — Behind-the-scenes looks at the playlist curation\n\n## How to Stay Connected\n\nSubscribe to our newsletter and never miss an update. We'll send you the latest news straight to your inbox.\n\n**Tune in now** — we've got 800+ songs playing 24/7!`,
        excerpt: "We're launching the official newsletter — here's what to expect!",
        category: "announcement",
        tags: JSON.stringify(["welcome", "launch"]),
        published: true,
        featured: true,
        pinned: true,
        publishedAt: new Date(),
        authorId: admin.id,
      },
      {
        title: "New Playlist Drop: Late Night Vibes",
        slug: "new-playlist-late-night-vibes",
        content: `# Late Night Vibes Playlist\n\nWe just added 25 new tracks to the rotation! Perfect for those late-night coding sessions or chill hangouts.\n\n## New Additions Include:\n- Lo-fi beats\n- Ambient electronic\n- Smooth jazz fusion\n- Acoustic chill\n\nCheck them out on the stream — they're already in rotation!\n\n> "Music is the universal language of mankind." — Henry Wadsworth Longfellow`,
        excerpt: "25 new tracks added to the rotation — perfect for late-night vibes.",
        category: "update",
        tags: JSON.stringify(["new-music", "playlist", "lo-fi"]),
        published: true,
        featured: false,
        pinned: false,
        publishedAt: new Date(Date.now() - 86400000),
        authorId: admin.id,
      },
      {
        title: "Stream Schedule & Community Events",
        slug: "stream-schedule-community-events",
        content: `# Upcoming Events\n\nHere's what's happening in the HomelessGuyNABOX community this month:\n\n## Weekly Schedule\n- **Monday-Friday**: Regular 24/7 stream rotation\n- **Saturday**: Community Request Hour (vote for songs!)\n- **Sunday**: Throwback Sunday — classic hits in rotation\n\n## Special Events\n1. **Song Request Week** — Submit your track suggestions\n2. **Genre Spotlight** — Each week we highlight a different genre\n3. **Community Spotlight** — Featured listeners and their stories\n\nStay tuned for more details!`,
        excerpt: "Check out our weekly schedule and upcoming community events.",
        category: "bulletin",
        tags: JSON.stringify(["schedule", "events", "community"]),
        published: true,
        featured: false,
        pinned: false,
        publishedAt: new Date(Date.now() - 172800000),
        authorId: admin.id,
      },
    ];

    for (const post of samplePosts) {
      await prisma.newsletter.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      });
    }

    console.log(`Created ${samplePosts.length} sample newsletters`);

    // Create site settings
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        siteName: "HomelessGuyNABOX",
        tagline: "24/7 Music Streaming",
        streamUrl: "https://homelessguynabox.org",
      },
    });

    console.log("Site settings initialized");
    console.log("\n--- Seed complete! ---");
    console.log("Admin credentials: username=admin, password=admin123");
    console.log("WARNING: Change the admin password before deploying!\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
