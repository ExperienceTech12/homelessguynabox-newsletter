const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');

const DB_PATH = '/app/prisma/dev.db';
const MIGRATION_PATH = '/app/prisma/migrations/20260223183348_init/migration.sql';

// Create database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  console.log('Creating database...');
  const db = new Database(DB_PATH);
  const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');
  db.exec(sql);
  db.close();
  console.log('Database created successfully');
}

// Seed if admin doesn't exist
const db = new Database(DB_PATH);
const admin = db.prepare('SELECT id FROM Admin WHERE username = ?').get('admin');

if (!admin) {
  console.log('Seeding database...');

  const adminId = crypto.randomUUID();
  // bcrypt hash of "admin123"
  const hash = '$2a$12$LJ3TjVcSBLmGUVMkbzKOPOxDGYR2X7FOvGz5aghyqp1qJJHCNRmKa';
  const now = new Date().toISOString();

  db.prepare(
    'INSERT INTO Admin (id, username, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(adminId, 'admin', hash, 'Admin', 'admin', now, now);

  console.log('Created admin user (username: admin, password: admin123)');

  // Welcome post
  db.prepare(
    'INSERT INTO Newsletter (id, title, slug, content, excerpt, category, tags, published, featured, pinned, publishedAt, createdAt, updatedAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 1, ?, ?, ?, ?)'
  ).run(
    crypto.randomUUID(),
    'Welcome to the HomelessGuyNABOX Newsletter!',
    'welcome-to-the-newsletter',
    '# Welcome!\n\nWe\'re excited to launch the official HomelessGuyNABOX Newsletter!\n\nThis is your go-to place for:\n\n- **New song additions** — Be the first to know when tracks drop\n- **Stream updates** — Schedule changes, special events, and more\n- **Community highlights** — Shoutouts, fan favorites, and listener stories\n- **Exclusive content** — Behind-the-scenes looks at the playlist curation\n\n## How to Stay Connected\n\nSubscribe to our newsletter and never miss an update.\n\n**Tune in now** — we\'ve got 800+ songs playing 24/7!',
    'We\'re launching the official newsletter — here\'s what to expect!',
    'announcement',
    '["welcome","launch"]',
    now, now, now, adminId
  );

  // Playlist update post
  db.prepare(
    'INSERT INTO Newsletter (id, title, slug, content, excerpt, category, tags, published, featured, pinned, publishedAt, createdAt, updatedAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?, ?, ?)'
  ).run(
    crypto.randomUUID(),
    'New Playlist Drop: Late Night Vibes',
    'new-playlist-late-night-vibes',
    '# Late Night Vibes Playlist\n\nWe just added 25 new tracks to the rotation! Perfect for those late-night coding sessions or chill hangouts.\n\n## New Additions Include:\n- Lo-fi beats\n- Ambient electronic\n- Smooth jazz fusion\n- Acoustic chill\n\nCheck them out on the stream — they\'re already in rotation!\n\n> "Music is the universal language of mankind." — Henry Wadsworth Longfellow',
    '25 new tracks added to the rotation — perfect for late-night vibes.',
    'update',
    '["new-music","playlist","lo-fi"]',
    now, now, now, adminId
  );

  // Community bulletin
  db.prepare(
    'INSERT INTO Newsletter (id, title, slug, content, excerpt, category, tags, published, featured, pinned, publishedAt, createdAt, updatedAt, authorId) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, ?, ?, ?, ?)'
  ).run(
    crypto.randomUUID(),
    'Stream Schedule & Community Events',
    'stream-schedule-community-events',
    '# Upcoming Events\n\nHere\'s what\'s happening in the HomelessGuyNABOX community this month:\n\n## Weekly Schedule\n- **Monday-Friday**: Regular 24/7 stream rotation\n- **Saturday**: Community Request Hour (vote for songs!)\n- **Sunday**: Throwback Sunday — classic hits in rotation\n\n## Special Events\n1. **Song Request Week** — Submit your track suggestions\n2. **Genre Spotlight** — Each week we highlight a different genre\n3. **Community Spotlight** — Featured listeners and their stories\n\nStay tuned for more details!',
    'Check out our weekly schedule and upcoming community events.',
    'bulletin',
    '["schedule","events","community"]',
    now, now, now, adminId
  );

  // Site settings
  db.prepare(
    'INSERT OR IGNORE INTO SiteSettings (id, siteName, tagline, aboutText, streamUrl, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run('singleton', 'HomelessGuyNABOX', '24/7 Music Streaming', '', 'https://homelessguynabox.org', now);

  console.log('Created 3 sample newsletters');
  console.log('Site settings initialized');
  console.log('--- Seed complete! ---');
} else {
  console.log('Database already seeded, skipping.');
}

db.close();
