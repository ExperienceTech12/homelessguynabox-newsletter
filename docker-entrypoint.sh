#!/bin/sh
set -e

# Run migrations using the SQL directly (avoids prisma.config.ts issues)
if [ ! -f /app/prisma/dev.db ]; then
  echo "Creating database..."
  cat /app/prisma/migrations/20260223183348_init/migration.sql | npx better-sqlite3-cli /app/prisma/dev.db 2>/dev/null || {
    # If better-sqlite3-cli isn't available, use node directly
    node -e "
      const Database = require('better-sqlite3');
      const fs = require('fs');
      const db = new Database('/app/prisma/dev.db');
      const sql = fs.readFileSync('/app/prisma/migrations/20260223183348_init/migration.sql', 'utf8');
      db.exec(sql);
      db.close();
      console.log('Database created successfully');
    "
  }
  echo "Database ready!"
fi

# Start the server
exec node server.js
