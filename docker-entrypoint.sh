#!/bin/sh
set -e

# Create and seed database if needed
node /app/seed-db.js

# Start the server
exec node server.js
