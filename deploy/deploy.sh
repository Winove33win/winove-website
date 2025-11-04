#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

# Build frontend
cd "$FRONTEND_DIR"
echo "Installing frontend dependencies..."
if ! npm ci; then
  echo "npm ci failed, falling back to npm install"
  npm install
fi

echo "Building frontend..."
npm run build

# Copy build to backend
cd "$ROOT_DIR"
rm -rf "$BACKEND_DIR/dist"
cp -r "$FRONTEND_DIR/dist" "$BACKEND_DIR/"
printf "SSR_INDEX_FILE=index.html\nNODE_ENV=production\n" > "$BACKEND_DIR/dist/.env"

echo "Frontend build copied to backend/dist"

# Generate sitemaps
npm --prefix "$BACKEND_DIR" run sitemap
echo "Sitemaps generated in httpdocs/"

