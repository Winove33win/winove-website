import { Router } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const LEADS_TABLE = process.env.LEADS_TABLE || "leads";
const LEADS_LIBRAS_TABLE = process.env.LEADS_LIBRAS_TABLE || "leads_libras";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "winove";
const DB_PASSWORD = process.env.DB_PASSWORD || "9*19avmU0";
const DB_NAME = process.env.DB_NAME || "fernando_winove_com_br_";

async function getConnection() {
  return await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
}

const sanitizeString = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === "string" || typeof value === "number") {
    const sanitized = value
      .toString()
      .replace(/[<>]/g, "")
      .trim();
    return sanitized.length ? sanitized : null;
  }
  return null;
};

const sanitizeObjectStrings = (obj = {}) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    acc[key] = typeof value === "string" ? sanitizeString(value) : value;
    return acc;
  }, {});
};

const logDetailedError = (context, err) => {
  const message = err?.message || err;
  console.error(`${context}:`, message);
  if (err?.stack) {
    console.error(err.stack);
  }
  if (err?.sqlMessage || err?.sqlState) {
    console.error("MySQL error details:", {
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
    });
  }
};

router.post("/", async (req, res) => {
  try {
    const {
      hp_field,
      nome,
      email,
      interesse,
      telefone,
      origem,
      mensagem,
      ...rawExtraFields
    } = req.body || {};

    if (hp_field && hp_field.trim()) return res.status(200).json({ ok: true });

    const sanitizedNome = sanitizeString(nome);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedInteresse = sanitizeString(interesse);

    if (!sanitizedNome || !sanitizedEmail || !sanitizedInteresse) {
      return res
        .status(400)
        .json({ error: "nome, email e interesse são obrigatórios" });
    }

    const sanitizedTelefone = sanitizeString(telefone);
    const sanitizedOrigem = sanitizeString(origem);
    const sanitizedMensagem = sanitizeString(mensagem);
    const sanitizedExtra = sanitizeObjectStrings(rawExtraFields);
    const extraPayload =
      Object.keys(sanitizedExtra).length > 0
        ? JSON.stringify(sanitizedExtra)
        : null;

    let conn;
    try {
      conn = await getConnection();
      await conn.execute(
        `INSERT INTO ${LEADS_TABLE}
         (nome, email, telefone, interesse, origem, mensagem, extra)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sanitizedNome,
          sanitizedEmail,
          sanitizedTelefone,
          sanitizedInteresse,
          sanitizedOrigem,
          sanitizedMensagem,
          extraPayload,
        ]
      );
      res.json({ ok: true });
    } finally {
      if (conn) {
        await conn.end().catch((closeErr) =>
          console.error("POST /api/leads connection close error:", closeErr)
        );
      }
    }
  } catch (err) {
    logDetailedError("POST /api/leads error", err);
    res.status(500).json({ error: "internal_error" });
  }
});

router.post("/libras", async (req, res) => {
  try {
    const hp = sanitizeString(req.body?.hp_field);
    if (hp) return res.status(200).json({ ok: true });

    const {
      nome,
      email,
      telefone,
      empresa,
      tipoServico,
      dataEvento,
      local: local_evento,
      tamanhoPublico,
      duracao,
      linkVideo,
      descricao,
      lgpdConsent,
    } = req.body || {};

    const sanitizedNome = sanitizeString(nome);
    const sanitizedEmail = sanitizeString(email);

    if (!sanitizedNome || !sanitizedEmail)
      return res
        .status(400)
        .json({ error: "nome e email são obrigatórios" });

    let conn;
    try {
      conn = await getConnection();
      await conn.execute(
        `INSERT INTO ${LEADS_LIBRAS_TABLE}
         (nome, email, telefone, empresa, tipoServico, dataEvento, local_evento, tamanhoPublico, duracao, linkVideo, descricao, lgpdConsent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sanitizedNome,
          sanitizedEmail,
          sanitizeString(telefone),
          sanitizeString(empresa),
          sanitizeString(tipoServico),
          sanitizeString(dataEvento),
          sanitizeString(local_evento),
          sanitizeString(tamanhoPublico),
          sanitizeString(duracao),
          sanitizeString(linkVideo),
          sanitizeString(descricao),
          lgpdConsent ? 1 : 0,
        ]
      );
      res.json({ ok: true });
    } finally {
      if (conn) {
        await conn.end().catch((closeErr) =>
          console.error("POST /api/leads/libras connection close error:", closeErr)
        );
      }
    }
  } catch (err) {
    logDetailedError("POST /api/leads/libras error", err);
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
