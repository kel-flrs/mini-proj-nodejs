import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid auth format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // e.g. { userId, name, age, iat, exp }
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(401).json({ error: 'Unauthorized - invalid or expired token' });
  }
};