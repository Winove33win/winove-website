import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(repoRoot, 'migrations');

const cfg = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'winove',
  password: process.env.DB_PASSWORD || '9*19avmU0',
  database: process.env.DB_NAME || 'fernando_winove_com_br_',
  multipleStatements: true,
};

const banner = (msg) => console.log(`\n=== ${msg} ===`);

async function ensureMigrationsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function getApplied(conn) {
  const [rows] = await conn.query('SELECT name FROM _migrations');
  return new Set(rows.map((r) => r.name));
}

async function applyFile(conn, filePath, name) {
  const raw = await fs.readFile(filePath, 'utf8');
  // Execute full script (multipleStatements enabled)
  await conn.query(raw);
  await conn.query('INSERT INTO _migrations (name) VALUES (?)', [name]);
}

async function main() {
  banner('DB MIGRATIONS');
  const conn = await mysql.createConnection(cfg);
  try {
    await ensureMigrationsTable(conn);
    const applied = await getApplied(conn);

    const files = (await fs.readdir(migrationsDir))
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let executed = 0;
    for (const f of files) {
      if (applied.has(f)) {
        console.log(`- skip ${f}`);
        continue;
      }
      const full = path.join(migrationsDir, f);
      console.log(`- apply ${f}`);
      await applyFile(conn, full, f);
      executed++;
    }

    console.log(`\nDone. Applied ${executed} migration(s).`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err?.message || err);
  process.exit(1);
});

