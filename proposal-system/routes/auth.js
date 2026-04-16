const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db/connection');
const { redirectIfAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: 'Muitas tentativas de login. Aguarde 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /login
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login', { error: null });
});

// POST /login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Preencha todos os campos.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);

    if (rows.length === 0) {
      return res.render('login', { error: 'Credenciais inválidas.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.render('login', { error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error('[Auth] Erro no login:', err);
    res.render('login', { error: 'Erro interno. Tente novamente.' });
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/login');
});

module.exports = router;
