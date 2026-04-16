require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const app = express();

// ─── Segurança ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'blob:'],
    }
  }
}));

// ─── Middlewares ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Template Engine ──────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Variáveis globais para as views
app.use((req, res, next) => {
  res.locals.baseUrl = process.env.BASE_URL || '';
  res.locals.successMsg = req.query.success || null;
  next();
});

// ─── Rotas ────────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/dashboard'));

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/proposals'));
app.use('/', require('./routes/pdf'));
app.use('/', require('./routes/email'));

// ─── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { user: null });
});

// ─── Erro global ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).send('Erro interno do servidor.');
});

// ─── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`[Server] Rodando na porta ${PORT}`);
  console.log(`[Server] Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = app;
