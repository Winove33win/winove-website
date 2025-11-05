#!/usr/bin/env node
/**
 * Script to update templates.meta for slug 'advocacia-blue-mode'
 * Usage: set env vars DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (or rely on defaults below)
 */
import mysql from 'mysql2/promise';

const DEFAULTS = {
  host: 'lweb03.appuni.com.br',
  port: 3306,
  user: 'winove',
  password: '9*19avmU0',
  database: 'fernando_winove_com_br_',
};

const DB_HOST = process.env.DB_HOST || DEFAULTS.host;
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : DEFAULTS.port;
const DB_USER = process.env.DB_USER || DEFAULTS.user;
const DB_PASSWORD = process.env.DB_PASSWORD || DEFAULTS.password;
const DB_NAME = process.env.DB_NAME || DEFAULTS.database;

const UPDATE_SQL = `
UPDATE \`templates\`
SET \`meta\` = JSON_MERGE_PATCH(
  \`meta\`,
  '{
    "currency": "BRL",
    "contact": {
      "whatsappIntl": "5519982403845",
      "defaultMessage": "Olá! Vim da página do Template Advocacia Blue Mode."
    },
    "ctaTexts": {
      "buyTemplate": "Comprar Template — R$ 750",
      "hosting": "Adicionar Hospedagem Plesk 3GB — R$ 564/ano",
      "email": "Adicionar E-mail Corporativo 3GB — R$ 250/ano",
      "bundle": "Combo (Site + Hospedagem + E-mail) — R$ 1.564 (1º ano)"
    },
    "addons": {
      "hosting": { "id": "hosting-plesk-3gb", "name": "Hospedagem Plesk 3GB", "priceYear": 564, "storageGB": 3, "panel": "Plesk" },
      "email": { "id": "email-corporativo-3gb", "name": "Conta de e-mail corporativa 3GB (1 conta)", "priceYear": 250, "quotaGB": 3, "accounts": 1 }
    },
    "bundles": [
      { "id": "combo-site-hosp-email", "name": "Combo: Site + Hospedagem + E-mail", "firstYear": 1564, "renewalYear": 814, "includes": ["template","hosting","email"], "cta": "Quero o Combo" }
    ]
  }'
)
WHERE \`slug\` = 'advocacia-blue-mode';
`;

async function main() {
  console.log('Connecting to MySQL %s@%s:%s/%s', DB_USER, DB_HOST, DB_PORT, DB_NAME);
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: false,
  });

  try {
    const [res] = await conn.execute(UPDATE_SQL);
    // mysql2 returns OkPacket
    const ok = res && typeof res === 'object' ? res : {};
    console.log('Update result:', ok);

    // Check affected rows
    const affected = ok.affectedRows ?? ok.affected_rows ?? 0;
    if (affected !== 1) {
      console.error(`Expected to affect exactly 1 row, affected: ${affected}`);
    } else {
      console.log('Update affected exactly 1 row (OK)');
    }

    // Verify meta value
    const [rows] = await conn.execute(
      "SELECT JSON_UNQUOTE(JSON_EXTRACT(meta, '$.contact.whatsappIntl')) AS wa FROM `templates` WHERE `slug` = ? LIMIT 1",
      ['advocacia-blue-mode']
    );
    const r = Array.isArray(rows) && rows.length ? rows[0] : null;
    const wa = r?.wa ?? null;
    console.log('Verified meta.contact.whatsappIntl =', wa);
    if (wa === '5519982403845') {
      console.log('Verification passed.');
    } else {
      console.error('Verification failed: expected 5519982403845');
    }

  } catch (err) {
    console.error('Error executing SQL:', err);
    process.exitCode = 2;
  } finally {
    await conn.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
