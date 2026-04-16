const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.clearCookie('auth_token');
    return res.redirect('/login');
  }
}

function redirectIfAuth(req, res, next) {
  const token = req.cookies?.auth_token;
  if (!token) return next();

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.redirect('/dashboard');
  } catch {
    next();
  }
}

module.exports = { requireAuth, redirectIfAuth };
