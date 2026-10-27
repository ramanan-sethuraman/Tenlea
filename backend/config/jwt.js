const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'tenlea_super_secret_jwt_key_2026_production_ready';

// Robust cleaner for JWT_SECRET (strips accidental surrounding quotes and whitespace)
const cleanSecret = (val) => {
  if (!val) return DEFAULT_SECRET;
  if (typeof val === 'string') {
    const cleaned = val.replace(/^["'`\s]+|["'`\s]+$/g, '').trim();
    if (cleaned && cleaned !== 'undefined' && cleaned !== 'null') {
      return cleaned;
    }
  }
  return DEFAULT_SECRET;
};

// Robust cleaner for JWT_EXPIRE (strips quotes, handles numeric strings and time units)
const cleanExpiresIn = (val) => {
  if (!val) return '30d';
  if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
  if (typeof val === 'string') {
    let cleaned = val.replace(/^["'`\s]+|["'`\s]+$/g, '').trim();
    if (!cleaned || cleaned === 'undefined' || cleaned === 'null') {
      return '30d';
    }
    // Pure digits e.g. "86400"
    if (/^\d+$/.test(cleaned)) {
      const num = parseInt(cleaned, 10);
      return !isNaN(num) && num > 0 ? num : '30d';
    }
    // Formats like "30d", "7d", "24h", "60m", "3600s"
    if (/^\d+[smhdwy]$/i.test(cleaned) || /^\d+\s*(seconds?|minutes?|hours?|days?|weeks?|years?)$/i.test(cleaned)) {
      return cleaned;
    }
  }
  return '30d';
};

const getJwtSecret = () => cleanSecret(process.env.JWT_SECRET);

const generateToken = (id) => {
  const secret = getJwtSecret();
  const expiresIn = cleanExpiresIn(process.env.JWT_EXPIRE);

  try {
    return jwt.sign({ id }, secret, { expiresIn });
  } catch (err) {
    console.warn(`[JWT Sign Warning]: ${err.message}. Retrying with default 30d expiry.`);
    try {
      return jwt.sign({ id }, secret, { expiresIn: '30d' });
    } catch (e2) {
      return jwt.sign({ id }, secret);
    }
  }
};

const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

module.exports = {
  cleanSecret,
  cleanExpiresIn,
  getJwtSecret,
  generateToken,
  verifyToken,
};
